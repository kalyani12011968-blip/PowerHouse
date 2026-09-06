<<<<<<< HEAD
function info(message, data = "") {
    console.log(`[INFO] ${message}`, data);
}

function warning(message, data = "") {
    console.log(`[WARNING] ${message}`, data);
}

function error(message, data = "") {
    console.error(`[ERROR] ${message}`, data);
}

module.exports = {
    info,
    warning,
    error
};
=======
const logger = {
  info: (...args) => console.log(new Date().toISOString(), "INFO", ...args),
  warn: (...args) => console.warn(new Date().toISOString(), "WARN", ...args),
  error: (...args) => console.error(new Date().toISOString(), "ERROR", ...args)
};

module.exports = logger;
>>>>>>> e236aa37c353724fa19dffdf3f7b9b17cecac8f5
