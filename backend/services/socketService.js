let io = null;

function initializeSocket(socketInstance) {

    io = socketInstance;
}

function emit(event, data) {

    if (!io) {
        return;
    }

    io.emit(
        event,
        data
    );
}

module.exports = {
    initializeSocket,
    emit
};