import { validateRequest } from "./utility.js";


function identifyUser(body, res) {
    console.log('Identify User Request##############', body);
    try {
        validateRequest(body);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
        return;
    }
    res.status(200).send({
        message: 'User identified successfully.'
    });
}


export { identifyUser, validateRequest}