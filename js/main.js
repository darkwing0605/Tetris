const local = new Local();
local.start();
const remote = new Remote();
remote.start(2, 2);
remote.bindEvents();
