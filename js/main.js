function game_2048(){
	this.cell_width = 100;
	this.cell_height = 100;
	this.cell_space = 20;
	this.board = new Array();	//棋盘数组
}

//棋盘初始化	开始新游戏
game_2048.prototype.init = function(){

	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var grid_cell = $("#grid_cell_"+ i + "_" + j);
			var pos = this.get_board_pos(i,j);
			grid_cell.css({
				"top" : pos.top +"px",
				"left" : pos.left+"px"
			});
		}
	}
	for (var i = 0; i < 4; i++) {
		this.board[i] = new Array();
		for (var j =0; j < 4; j++) {
			this.board[i][j] = 0;
		}
	}
	

	//随机2个数字
	this.get_random_num();
	this.get_random_num();

	//更新棋盘
	this.update_board_view();

	//绑定键盘按键
	this.bind_board_event();
}

//初始化 各个棋格数字
game_2048.prototype.update_board_view = function(){
	$('.number_cell').remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#grid_container').append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
			var number_cell = $("#number_cell_" + i + "_" + j);
			if(this.board[i][j] == 0){
				number_cell.css({
					"width" : "0px",
					"height" : "0px",
					"top" :  this.get_board_pos(i, j).top  + this.cell_height / 2 + "px",
					"left" :  this.get_board_pos(i, j).left + this.cell_width / 2 + "px"
				});
			}else{
				number_cell.css({
					"width" : this.cell_width,
					"height" : this.cell_height,
					"top" : this.get_board_pos(i, j).top,
					"left" :this.get_board_pos(i, j).left,
					"backgroundColor" : this.get_number_background_color(this.board[i][j]),
					"color" : this.get_number_color(this.board[i][j])
				});
				number_cell.text(this.board[i][j]);
			}
		}
	}
	$('.number_cell').css('line-height', this.cell_height + 'px');
	$('.number_cell').css('font-size', 0.6 * this.cell_height + 'px');
}

//返回指定棋格位置
game_2048.prototype.get_board_pos = function(i,j){

	var top = i * (this.cell_width + this.cell_space) + this.cell_space;
	var left = j * (this.cell_height + this.cell_space) + this.cell_space;
	return { top :  top, left : left };
}

//随机获得两个数字
game_2048.prototype.get_random_num = function(){

	if(!this.have_space()){
		return false;
	}
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));
	var randNum = Math.random() < 0.5 ? 2 : 4;

	var time = 0;
	while (time < 50) {		//用来寻找未占用的棋格
		if (this.board[randx][randy] == 0) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
		time++;
	}
	if(time == 50){		//如果50次循环完毕依然没有找到未占用的格子
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if(this.board[i][j] == 0){		//那么就从头到位遍历一遍 找到未占用的
                    randx = i;
                    randy = j;
				}
			}
		}
	}

	this.board[randx][randy] = randNum;
	
}

//pc端 绑定键盘事件
game_2048.prototype.bind_board_event = function(){
	var that = this;
	$(document).unbind('keyup');
	$(document).keyup(function(event){
		switch (event.keyCode){
			case 37 : {
				if( that.move_left() ){
					that.get_random_num();
				}
				break;
			}
			case 38 : {
				if( that.move_top() ){
					that.get_random_num();
				}
				break;
			}
			case 39 : {
				if( that.move_right() ){
					that.get_random_num();
				}
				break;
			}
			case 40 : {
				if( that.move_down() ){
					that.get_random_num();
				}
				break;
			}
			default : break;
		}
	});
}

//左移
game_2048.prototype.move_left = function(){

	if(!this.can_move_left()){
		return false
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if( this.board[i][j] != 0 ){
				for (var k = 0; k < j ;k++) {
					if( this.board[i][k] == 0 && this.no_block_row(i,k,j) ){
						this.cell_move(i,j,i,k);
						this.board[i][k] = this.board[i][j];
						this.board[i][j] = 0;
						break;
					}else if( this.board[i][k] == this.board[i][j] && this.no_block_row(i,k,j) ){
						this.cell_move(i,j,i,k);
						this.board[i][k] += this.board[i][j];
						this.board[i][j] = 0;
						break;
					}
				}
			}
		}
	}
	var that = this;
	setTimeout(function(){		//由于动画200毫秒 所以加上延时
		that.update_board_view();		//更新棋盘
	},200);
	return true;
}

//右移
game_2048.prototype.move_right = function(){

	if(!this.can_move_right()){
		return false
	}
	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if( this.board[i][j] != 0 ){
				for (var k = 3; k > j ;k--) {
					if( this.board[i][k] == 0 && this.no_block_row(i,j,k) ){
						this.cell_move(i,j,i,k);
						this.board[i][k] = this.board[i][j];
						this.board[i][j] = 0;
						break;
					}else if( this.board[i][k] == this.board[i][j] && this.no_block_row(i,j,k) ){
						this.cell_move(i,j,i,k);
						this.board[i][k] += this.board[i][j];
						this.board[i][j] = 0;
						break;
					}
				}
			}
		}
	}
	var that = this;
	setTimeout(function(){		//由于动画200毫秒 所以加上延时
		that.update_board_view();		//更新棋盘
	},200);
	return true;
}

//上移
game_2048.prototype.move_top = function(){

	if(!this.can_move_top()){
		return false
	}
	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if(this.board[i][j] != 0){
				for (var k = 0; k < i; k++) {
					if( this.board[k][j] == 0 && this.no_block_col(j,k,i) ){
						this.cell_move(i,j,k,j);
						this.board[k][j] = this.board[i][j];
						this.board[i][j] = 0;
						break;
					}else if( this.board[k][j] == this.board[i][j] && this.no_block_col(j,k,i) ){
						this.cell_move(i,j,k,j);
						this.board[k][j] += this.board[i][j];
						this.board[i][j] = 0;
						break;
					}
				}
			}
		}
	}


	var that = this;
	setTimeout(function(){		//由于动画200毫秒 所以加上延时
		that.update_board_view();		//更新棋盘
	},200);
	return true;
}

//下移
game_2048.prototype.move_down = function(){

	if(!this.can_move_down()){
		return false
	}
	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if(this.board[i][j] != 0){
				for (var k = 3; k > i; k--) {
					if( this.board[k][j] == 0 && this.no_block_col(j,i,k) ){
						this.cell_move(i,j,k,j);
						this.board[k][j] = this.board[i][j];
						this.board[i][j] = 0;
						break;
					}else if( this.board[k][j] == this.board[i][j] && this.no_block_col(j,i,k) ){
						this.cell_move(i,j,k,j);
						this.board[k][j] += this.board[i][j];
						this.board[i][j] = 0;
						break;
					}
				}
			}
		}
	}


	var that = this;
	setTimeout(function(){		//由于动画200毫秒 所以加上延时
		that.update_board_view();		//更新棋盘
	},200);
	return true;
}

//检查是否能左移
game_2048.prototype.can_move_left = function(){
	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if( this.board[i][j] != 0 ){
				if( this.board[i][j - 1] == 0 || this.board[i][j] == this.board[i][j - 1] ){
					return true
				}
			}
		}
	}
	return false;
}
//检查是否能右移
game_2048.prototype.can_move_right = function(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 3; j++) {
			if( this.board[i][j] != 0 ){
				if( this.board[i][j + 1] == 0 || this.board[i][j] == this.board[i][j + 1] ){
					return true
				}
			}
		}
	}
	return false;
}


//检查是否能上移
game_2048.prototype.can_move_top = function(){
	for (var i = 1; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if( this.board[i][j] != 0 ){
				if( this.board[i-1][j] == 0 || this.board[i][j] == this.board[i-1][j] ){
					return true
				}
			}
		}
	}
	return false;
}
//检查是否能下移
game_2048.prototype.can_move_down = function(){
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			if( this.board[i][j] != 0 ){
				if( this.board[i+1][j] == 0 || this.board[i][j] == this.board[i+1][j] ){
					return true
				}
			}
		}
	}
	return false;
}

//检查是否有空的横间隔
game_2048.prototype.no_block_row = function(row,colstart,colend){
	for (var i = colstart + 1; i < colend; i++) {
		if( this.board[row][i] != 0 ){
			return false;
		}
	}
	return true;
}

//检查是否有空的竖间隔
game_2048.prototype.no_block_col = function(col,rowstart,rowend){
	for (var i = rowstart + 1; i < rowend; i++) {
		if( this.board[i][col] != 0 ){
			return false;
		}
	}
	return true;
}


//检查是否有剩余格子
game_2048.prototype.have_space = function(){
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if( this.board[i][j] == 0 ){
				return true;
			}
		}
	}	
	return false;
}

//根据数字返回背景颜色
game_2048.prototype.get_number_background_color = function(number){
	switch (number) {
		case 2: return '#eee4da'; break;
		case 4: return '#ede0c8'; break;
		case 8: return '#f2b179'; break;
		case 16: return '#f59563'; break;
		case 32: return '#f67c5f'; break;
		case 64: return '#f65e3b'; break;
		case 128: return '#edcf72'; break;
		case 256: return '#edcc61'; break;
		case 512: return '#9c0'; break;
		case 1024: return '#33b5e5'; break;
		case 2048: return '#09c'; break;
		case 4096: return '#a6c'; break;
		case 8192: return '#93c'; break;
	}
	return 'black';
}

//根据数字返回文本颜色
game_2048.prototype.get_number_color = function(number) {
	if (number <= 4)
		return '#776e65';
	return 'white';
}

//移动
game_2048.prototype.cell_move = function(fx,fy,tx,ty){

	var number_cell = $('#number_cell_' + fx + '_' + fy);
	var pos = this.get_board_pos(tx,ty);
	number_cell.css({
		top : pos.top,
		left : pos.left
	});
}



