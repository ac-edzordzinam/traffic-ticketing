module.exports.generate = function (error, message, status, data) {

    const myResponse = {
        error: error,
        message: message,
        status: status,
        data: data
    };

    return myResponse;

}