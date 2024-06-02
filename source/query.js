import { client } from "../index.js";



async function userQueryExec(body) {
    console.log('User Query Execution##############', body);

    try {
        await client.query('BEGIN');

        const selectContactQuery = 'SELECT * FROM contact WHERE (email = $1 OR phone_number = $2)';
        const selectContactResult = await client.query(selectContactQuery, [body.email, body.phoneNumber]);

        console.log('Select all entries---------', selectContactResult.rows);

        if (selectContactResult.rows.length > 0) {
            let linkedId;

            let primaryContact = selectContactResult.rows.filter(contact => contact.link_precedence === 'primary');
            if (primaryContact.length === 0) {
                primaryContact = selectContactResult.rows.filter(contact => contact.link_precedence === 'secondary' && contact.linked_id != null);
                linkedId = primaryContact[0].linked_id;
            } else {
                linkedId = primaryContact[0].id;
            }
            console.log('Primary Contact---------', primaryContact, linkedId);

            try {
                const secondaryContactQuery = `
                    INSERT INTO contact (phone_number, email, link_precedence, linked_id ,created_at, updated_at)
                    VALUES ($1, $2, $3::link_precedence, $4::integer, $5::TIMESTAMPTZ, $6::TIMESTAMPTZ)
                    RETURNING *`;

                const secondaryContactResult = await client.query(secondaryContactQuery, [body.phoneNumber, body.email, 'secondary', linkedId, new Date().toISOString(), new Date().toISOString()]);

                console.log('secondary entry---------', secondaryContactResult.rows);
            } catch (error) {
                if (error.code === '23505' && (error.constraint === 'unique_phone_where_email_null' || error.constraint === 'unique_email_where_phone_null')) {
                    // Ignore the error
                } else {
                    // Handle the error
                    throw error;
                }
            }
        } else {
            const primaryContactsQuery = 'Insert into contact (phone_number, email, link_precedence, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING *';
            const primaryContactsResult = await client.query(primaryContactsQuery, [body.phoneNumber, body.email, 'primary', new Date().toISOString(), new Date().toISOString()]);

            console.log('Primary entry!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', primaryContactsResult.rows);
        }

        

        console.log('here to continue@@@@@@@@@@@@@@@@@@@@@@@@@')

        // if (primaryContactResult.rows.length > 0) {
        //   const primaryContact = primaryContactResult.rows[0];

        //   const secondaryContactsQuery = 'SELECT * FROM contact WHERE linked_id = $1';
        //   const secondaryContactsResult = await client.query(secondaryContactsQuery, [primaryContact.id]);

        //   const secondaryContactIds = secondaryContactsResult.rows.map(contact => contact.id);

        //   const response = {
        //     contact: {
        //       primaryContatctId: primaryContact.id,
        //       emails: [primaryContact.email],
        //       phoneNumbers: [primaryContact.phone_number],
        //       secondaryContactIds: secondaryContactIds,
        //     },
        //   };

        //   res.status(200).json(response);
        // } else {
        //   const insertContactQuery = 'INSERT INTO contact (phone_number, email, link_precedence, created_at) VALUES($1, $2, $3, $4) RETURNING *';
        //   const insertContactResult = await client.query(insertContactQuery, [phoneNumber, email, 'primary', new Date()]);

        //   const newContact = insertContactResult.rows[0];

        //   const response = {
        //     contact: {
        //       primaryContatctId: newContact.id,
        //       emails: [newContact.email],
        //       phoneNumbers: [newContact.phone_number],
        //       secondaryContactIds: [],
        //     },
        //   };

        //   res.status(200).json(response);
        // }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error.stack);
    }





}

export { userQueryExec };