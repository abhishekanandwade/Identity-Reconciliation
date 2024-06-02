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

export { validateRequest };