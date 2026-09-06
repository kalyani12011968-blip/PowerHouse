<<<<<<< HEAD
function success(res, data, message = "Success") {

    return res.status(200).json({
        success: true,
        message,
        data
    });
}

function created(res, data, message = "Created") {

    return res.status(201).json({
        success: true,
        message,
        data
    });
}

function failure(
    res,
    message = "Request failed",
    statusCode = 500
) {

    return res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = {
    success,
    created,
    failure
};
=======
const success = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data
  });
};

const failure = (res, message, status = 400) => {
  return res.status(status).json({
    success: false,
    message
  });
};

module.exports = {
  success,
  failure
};
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
