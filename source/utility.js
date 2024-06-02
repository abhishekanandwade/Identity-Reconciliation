function validateRequest(body) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{6}$/;

    if (!body.email && !body.phoneNumber) {
        throw new Error('Email and phone number are both missing.');
    }

    if (body.email) {
        if (typeof body.email !== 'string') {
            throw new Error('Email must be a string.');
        }
        if (!emailRegex.test(body.email)) {
            throw new Error('Invalid email format.');
        }
    }

    if (body.phoneNumber) {
        if (typeof body.phoneNumber !== 'string') {
            throw new Error('Phone number must be a string.');
        }
        if (!phoneRegex.test(body.phoneNumber)) {
            throw new Error('Phone number must be a string of 6 digits');
        }
    }

    return true;
}


function constructResult(contacts) {
    // Find the primary contact
    const primaryContact = contacts.find(contact => contact.link_precedence === 'primary');

    // If no primary contact, return null or throw an error
    if (!primaryContact) {
        return null;
    }

    // Find the secondary contacts
    const secondaryContacts = contacts.filter(contact => contact.linked_id === primaryContact.id);

    // Construct the result object
    const result = {
        contact: {
            primaryContatctId: primaryContact.id,
            emails: [],
            phoneNumbers: [],
            secondaryContactIds: secondaryContacts.map(contact => contact.id)
        }
    };

    // Add primary contact's email and phone number if they are not null
    if (primaryContact.email) {
        result.contact.emails.push(primaryContact.email);
    }
    if (primaryContact.phone_number) {
        result.contact.phoneNumbers.push(primaryContact.phone_number);
    }

    // Add secondary contacts' emails and phone numbers if they are not null
    result.contact.emails.push(...secondaryContacts.map(contact => contact.email).filter(email => email));
    result.contact.phoneNumbers.push(...secondaryContacts.map(contact => contact.phone_number).filter(phoneNumber => phoneNumber));

    return result;
}

export { validateRequest, constructResult };