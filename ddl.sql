CREATE TYPE link_precedence AS ENUM ('secondary', 'primary');

CREATE TABLE Contact (
    id SERIAL PRIMARY KEY NOT NULL,
    phone_number VARCHAR(255),
    email VARCHAR(255),
    linked_id INT,
    link_Precedence link_precedence NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP
);

ALTER TABLE contact
ADD CONSTRAINT unique_phone_email UNIQUE (phone_number, email);

CREATE UNIQUE INDEX unique_phone_where_email_null ON contact (phone_number) WHERE email IS NULL;
CREATE UNIQUE INDEX unique_email_where_phone_null ON contact (email) WHERE phone_number IS NULL;