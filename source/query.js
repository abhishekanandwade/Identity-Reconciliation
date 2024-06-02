import { client } from "../index.js";



async function userQueryExec(body) {
    console.log('User Query Execution##############', body);

    // query to get the user details
    // const query = {
    //     text: 'INSERT INTO contact (phone_number, email,link_precedence, created_at,updated_at) VALUES($1, $2, $3, $4,$5)',
    //     values: [body.phoneNumber, body.email, 'primary', new Date(), new Date()],
    // };

    // // execute the query
    // client.query(query, (err, res) => {
    //     if (err) {
    //         console.error(err.stack);
    //     } else {
    //         console.log(res.rows[0]);
    //     }
    // });

    try {
        await client.query('BEGIN');

        const primaryContactQuery = 'SELECT * FROM contact WHERE (email = $1 OR phone_number = $2)';
        const primaryContactResult = await client.query(primaryContactQuery, [body.email, body.phoneNumber]);

        console.log('Select all entries---------', primaryContactResult.rows);

        if (primaryContactResult.rows.length > 0) {
            const primaryContactQuery = `
                WITH params AS (
                    SELECT
                        $1 AS phone_number,
                        $2 AS email,
                        $3::link_precedence AS link_precedence,
                        $4::TIMESTAMPTZ AS created_at,
                        $5::TIMESTAMPTZ AS updated_at
                )
                INSERT INTO contact (phone_number, email, link_precedence, created_at, updated_at)
                SELECT phone_number, email, link_precedence, created_at, updated_at FROM params
                WHERE NOT EXISTS (
                    SELECT 1 FROM contact WHERE phone_number = (SELECT phone_number FROM params) AND email = (SELECT email FROM params)
                )
                RETURNING *`;

            const primaryContactResult = await client.query(primaryContactQuery, [body.phoneNumber, body.email, 'secondary', new Date().toISOString(), new Date().toISOString()]);

            console.log('secondary entry---------', primaryContactResult.rows);
        }

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