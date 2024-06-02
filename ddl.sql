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