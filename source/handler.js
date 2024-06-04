import { userQueryExec } from "./query.js";
import { validateRequest } from "./utility.js";


function identifyUser(body, res) {

    // validate the request
    try {
        validateRequest(body);
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
        return;
    }

    // identify the user
    userQueryExec(body).then((result) => {
        if (result && result.contact) {
            res.status(200).send(result);
        }
    }).catch((error) => {
        res.status(500).send({
            error: error.message
        });
    });
}


export { identifyUser, validateRequest }