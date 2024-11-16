const socket = io();
const imgElement = document.getElementById('display');

// Listen for image updates
socket.on('update_image', (data) => {
    imgElement.src = `/static/images/${data.image}`;
});