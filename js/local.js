const Local = function() {
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
			} else if (e.keyCode === 39) {
				// right
				game.right();
			} else if (e.keyCode === 40) {
				// down
				game.down();
			} else if (e.keyCode === 37) {
				// left
				game.left();
			} else if (e.keyCode === 32) {
				// space
				game.fall();
			}
		}
	}
	// 移动
	const move = function() {
		timeFunc();
		if(!game.down()) {
			game.fixed();
			let line = game.checkClear();
			if (line) {
				game.addScore(line);
			}
			let gameOver = game.checkGameOver();
			if (gameOver) {
				stop();
				game.gameover(false);
			} else {
				game.performNext(generateType(), generateDir());
			}
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
			if (time % 10 === 0) {
				game.addTailLines(gererataBottomLine(1));
			}
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
		game.init(doms, generateType(), generateDir());
		bindKeyEvent();
		game.performNext(generateType(), generateDir());
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
	// 导出API
	this.start = start;
}