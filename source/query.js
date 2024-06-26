import { client } from "../index.js";
import { constructResult } from "./utility.js";



async function userQueryExec(body) {
    let finalResult
    let selectAllContactsResult

    try {
        await client.query('BEGIN');

        const selectContactQuery = 'SELECT * FROM contact WHERE (email = $1 OR phone_number = $2)';
        const selectContactResult = await client.query(selectContactQuery, [body.email, body.phoneNumber]);

        if (selectContactResult.rows.length > 0) {
            let linkedId;
            let dualPrimary = false;
            let primaryContact = selectContactResult.rows.filter(contact => contact.link_precedence === 'primary');
            if (primaryContact.length === 0) {
                primaryContact = selectContactResult.rows.filter(contact => contact.link_precedence === 'secondary' && contact.linked_id != null);
                linkedId = primaryContact[0].linked_id;
            } else {
                if (primaryContact.length == 2) {
                    dualPrimary = true;
                }
                linkedId = primaryContact[0].id;
            }
            if (dualPrimary == false) {

                try {
                    const secondaryContactQuery = `
                    INSERT INTO contact (phone_number, email, link_precedence, linked_id ,created_at, updated_at)
                    VALUES ($1, $2, $3::link_precedence, $4::integer, $5::TIMESTAMPTZ, $6::TIMESTAMPTZ)
                    ON CONFLICT (phone_number, email)
                    DO NOTHING
                    RETURNING *`;

                    const secondaryContactResult = await client.query(secondaryContactQuery, [body.phoneNumber, body.email, 'secondary', linkedId, new Date().toISOString(), new Date().toISOString()]);

                } catch (error) {
                    if (error.code === '23505' && (error.constraint === 'unique_phone_where_email_null' || error.constraint === 'unique_email_where_phone_null')) {
                        // Ignore the error
                    } else {
                        // Handle the error
                        throw error;
                    }
                }
            } else {
                let primaryPhoneNumberId = primaryContact.filter(contact => contact.phone_number == body.phoneNumber);
                let primaryEmailId = primaryContact.filter(contact => contact.email == body.email);
                let emailIdPrimary = primaryEmailId[0].id;
                let phoneIdPrimary = primaryPhoneNumberId[0].id;
                const updatePrimary = 'UPDATE contact SET linked_id = $1, link_precedence = $2, updated_at = $3 WHERE id = $4';
                const updatePrimaryResult = await client.query(updatePrimary, [emailIdPrimary, 'secondary', new Date().toISOString(), phoneIdPrimary]);

                const updateSecondary = 'UPDATE contact SET linked_id = $1, updated_at = $2 WHERE linked_id = $3';
                const updateSecondaryResult = await client.query(updateSecondary, [emailIdPrimary, new Date().toISOString(), phoneIdPrimary]);

            }
        } else {
            const primaryContactsQuery = 'Insert into contact (phone_number, email, link_precedence, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *';
            const primaryContactsResult = await client.query(primaryContactsQuery, [body.phoneNumber, body.email, 'primary', new Date().toISOString(), new Date().toISOString()]);
        }

        const selectAllContacts = `SELECT A.*
        FROM Contact A
        WHERE A.linked_id IN (
            SELECT linked_id
            FROM Contact
            WHERE ${body.phoneNumber ? 'phone_number' : 'email'} = $1 AND linked_id IS NOT NULL
        ) OR A.id IN (
            SELECT linked_id
            FROM Contact
            WHERE ${body.phoneNumber ? 'phone_number' : 'email'} = $1 AND linked_id IS NOT NULL
        ) OR A.id IN (
            SELECT id
            FROM Contact
            WHERE ${body.phoneNumber ? 'phone_number' : 'email'} = $1
        );`;

        if (body.phoneNumber) {
            selectAllContactsResult = await client.query(selectAllContacts, [body.phoneNumber]);

        } else {
            selectAllContactsResult = await client.query(selectAllContacts, [body.email]);
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error.stack);
    }
    finalResult = constructResult(selectAllContactsResult.rows);
    return finalResult;
}

export { userQueryExec };