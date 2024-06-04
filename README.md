# Identity Reconciliation Service

## Hosted URL

The service is hosted at: [https://identity-reconciliation-l95z.onrender.com](https://identity-reconciliation-l95z.onrender.com)


## Overview

This repository contains the implementation of a web service designed to reconcile customer identities across multiple purchases on FluxKart.com. The service aims to link different orders made with different contact information (email and phone number) to the same person, providing a consolidated view of the customer's contact details.

## Features

- **Identify Endpoint**: Receives HTTP POST requests with contact details (email and/or phone number) and returns a consolidated contact profile.
- **Contact Linking**: Links contact details that share either an email or phone number, treating the oldest contact as "primary" and others as "secondary".
- **Contact Creation**: Creates new contact entries for unique contact details.

## Tech Stack

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building the RESTful API.
- **PostgreSQL**: Relational database for storing contact details.

## Endpoints

### /identify

**Method**: POST

```json
{
    "email"?: string,
    "phoneNumber"?: string
}
```


## Install Dependencies:

```sh
npm install
```

## Configure Database:

- Set up a PostgreSQL database.
- Update the database connection settings in config.js or .env file.


## Start the Server:

```sh
npm start
```
## Usage

Send a POST request to the /identify endpoint with either an email, phone number, or both. The service will return the consolidated contact information, linking related contacts and creating new entries as necessary.

```sh
curl -X POST https://identity-reconciliation-l95z.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}'
```

### Example Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
