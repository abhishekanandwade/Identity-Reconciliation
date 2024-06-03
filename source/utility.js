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
            secondaryContactIds: []
        }
    };

    // Add primary contact's email and phone number if they are not null
    if (primaryContact.email) {
        result.contact.emails.push(primaryContact.email);
    }
    if (primaryContact.phone_number) {
        result.contact.phoneNumbers.push(primaryContact.phone_number);
    }

    // Add secondary contacts' emails, phone numbers, and IDs if they are not null and not duplicates
    secondaryContacts.forEach(contact => {
        if (contact.email && !result.contact.emails.includes(contact.email)) {
            result.contact.emails.push(contact.email);
            result.contact.secondaryContactIds.push(contact.id);
        }
        if (contact.phone_number && !result.contact.phoneNumbers.includes(contact.phone_number)) {
            result.contact.phoneNumbers.push(contact.phone_number);
            if (!result.contact.secondaryContactIds.includes(contact.id)) {
                result.contact.secondaryContactIds.push(contact.id);
            }
        }
    });

    // Remove duplicates by converting to a Set and then back to an array
    result.contact.emails = [...new Set(result.contact.emails)];
    result.contact.phoneNumbers = [...new Set(result.contact.phoneNumbers)];
    result.contact.secondaryContactIds = [...new Set(result.contact.secondaryContactIds)];

    return result;
}

export { validateRequest, constructResult };