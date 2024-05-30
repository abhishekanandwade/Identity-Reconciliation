function validateRequest(body) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{6}$/;

    if (!body.email && !body.phoneNumber) {
        throw new Error('Email and phone number are both missing.');
    }

    if (body.email && !emailRegex.test(body.email)) {
        throw new Error('Invalid email format.');
    }

    if (body.phoneNumber && !phoneRegex.test(body.phoneNumber)) {
        throw new Error('Invalid phone number format.');
    }

    return true;
}

export { validateRequest };