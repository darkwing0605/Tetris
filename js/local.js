const Local = function(socket) {
	// 游戏对象
	let game;
	// 时间间隔
	let INTERVAL = 200;
	// 定时器
	let timer = null;
	// 时间计数器
	let timeCount = 0;
	// 时间
	let time = 0;
	// 绑定键盘事件
	const bindKeyEvent = function() {
		document.onkeydown = function(e) {
			if (e.keyCode === 38) {
				// up
				game.rotate();
				socket.emit('rotate');
			} else if (e.keyCode === 39) {
				// right
				game.right();
				socket.emit('right');
			} else if (e.keyCode === 40) {
				// down
				game.down();
				socket.emit('down');
			} else if (e.keyCode === 37) {
				// left
				game.left();
				socket.emit('left');
			} else if (e.keyCode === 32) {
				// space
				game.fall();
				socket.emit('fall');
			}
		}
	}
	// 移动
	const move = function() {
		timeFunc();
		if(!game.down()) {
			game.fixed();
			socket.emit('fixed');
			let line = game.checkClear();
			if (line) {
				game.addScore(line);
				socket.emit('line', line);
				if (line > 1) {
					let bottomLines = gererataBottomLine(line);
					socket.emit('bottomLines', bottomLines)
				}
			}
			let gameOver = game.checkGameOver();
			if (gameOver) {
				stop();
				game.gameover(false);
				document.getElementById('remote_gameover').innerHTML = '你赢了';
				socket.emit('lose');
			} else {
				let t = generateType();
				let d = generateDir();
				game.performNext(t, d);
				socket.emit('next', {type: t, dir: d});
			}
		} else {
			socket.emit('down');
		}
	}
	// 随机生成干扰行
	const gererataBottomLine = function(lineNum) {
		let lines = [];
		for (let i = 0; i < lineNum; i++) {
			let line = [];
			for (let j = 0; j < 10; j++) {
				line.push(Math.ceil(Math.random() * 2) - 1);
			}
			lines.push(line);
		}
		return lines;
	}
	// 计时函数
	const timeFunc = function() {
		timeCount++;
		if (timeCount === 5) {
			timeCount = 0;
			time++;
			game.setTime(time);
			socket.emit('time', time)
		}
	}
	// 随机生成一个方块种类
	const generateType = function() {
		return Math.ceil(Math.random() * 7) - 1;
	}
	// 随机生成一个旋转次数
	const generateDir = function() {
		return Math.ceil(Math.random() * 4) - 1;
	}
	// 开始
	const start = function() {
		const doms = {
			gameDiv: document.getElementById('local_game'),
			nextDiv: document.getElementById('local_next'),
			timeDiv: document.getElementById('local_time'),
			scoreDiv: document.getElementById('local_score'),
			resultDiv: document.getElementById('local_gameover')
		}
		game = new Game();
		let type = generateType();
		let dir = generateDir();
		game.init(doms, type, dir);
		socket.emit('init', {type: type, dir: dir});
		bindKeyEvent();
		let t = generateType();
		let d = generateDir();
		game.performNext(t, d);
		socket.emit('next', {type: t, dir: d});
		timer = setInterval(move, INTERVAL);
	}
	// 结束
	const stop = function() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		document.onkeydown = null;
	}

	socket.on('start', function() {
		document.getElementById('waiting').innerHTML = '';
		start();
	})

	socket.on('lose', function() {
		game.gameover(true);
		stop();
	})

	socket.on('leave', function() {
		document.getElementById('local_gameover').innerHTML = '对方离线';
		document.getElementById('remote_gameover').innerHTML = '已离线';
		stop();
	})

	socket.on('bottomLines', function(data) {
		game.addTailLines(data);
		socket.emit('addTailLines', data);
	})
}