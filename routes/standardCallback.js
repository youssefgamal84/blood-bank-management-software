var callback = (req, res, dataName) => {
    var toreturn = (errorMessage, statusCode, data) => {
        if (errorMessage) {
            return res.status(statusCode).send({ errorMessage });
        }
        var object = {};
        object[dataName] = data;
        res.send(object);
    }

    return toreturn;
}

module.exports = callback;