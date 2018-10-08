const socket = io('ws://127.0.0.1:9960');

const local = new Local(socket);
const remote = new Remote(socket);

socket.on('waiting', function(str) {
	document.getElementById('waiting').innerHTML = str;
})
