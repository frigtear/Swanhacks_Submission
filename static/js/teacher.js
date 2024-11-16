const socket = io();

function changeImage(image) {
    socket.emit('change_image', { image: image });
}