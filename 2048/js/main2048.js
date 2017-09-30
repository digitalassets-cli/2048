
var board=new Array();
var score=0;
var hasConflict=new Array();
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function() {

	prepareForMobile();
	newGame();	

});
function prepareForMobile(){
	if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 90;
    }

	$("#grid-container").css('width', gridContainerWidth-2*cellSpace);
	$("#grid-container").css('height',gridContainerWidth-2*cellSpace);
	$("#grid-container").css('padding',cellSpace);
	$("#grid-container").css('border-radius',0.04*gridContainerWidth);


	$(".grid-cell").css('width', cellSideLength);
	$(".grid-cell").css('height', cellSideLength);
	$(".grid-cell").css('border-radius',0.1*cellSideLength);

}
function newGame(){
	//初始化
	init();
	//随机生成两个数字
	generateOneNumber();
	generateOneNumber();
}
function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridcell=$("#grid-cell-"+i+"-"+j);
			gridcell.css('top', getPosTop(i,j) );
            gridcell.css('left', getPosLeft(i,j));
            
		}	
	}


	//二维数组
	for(var i=0; i<4 ;i++){
		 board[i]=new Array();
		 hasConflict[i]=new Array();
		for (var j = 0; j<4;j++){
			board[i][j]=0;
			hasConflict[i][j]=false;
		}
	}

	updateBoardView();
	score=0;

}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i =0; i<4 ;i++){
		for(var j=0; j<4;j++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var numbercell=$('#number-cell-'+i+'-'+j);

			if(board[i][j]==0){
				numbercell.css('width', '0px');
				numbercell.css('height', '0px');
				numbercell.css('top', getPosTop( i , j )+cellSideLength*0.5);
				numbercell.css('left', getPosLeft( i , j )+cellSideLength*0.5);
			}else{
				numbercell.css('width', cellSideLength);
				numbercell.css('height', cellSideLength);
				numbercell.css('top', getPosTop(i,j) );
            	numbercell.css('left', getPosLeft(i,j));
            	numbercell.css('color', getNumberColor(board[i][j]));
            	numbercell.css('background-color', getNumberBackgroundColor(board[i][j]));
            	numbercell.text(board[i][j]);

			}
			hasConflict[i][j]=false;
		}

	}
	$(".number-cell").css('line-height', cellSideLength+'px');
	$(".number-cell").css('font-size', 0.6*cellSideLength+'px');
	

}

function generateOneNumber(){
	//判断是否有空间
	if(nospace(board))
		return false;
		//生成随机位置
		var times=0;
		var randX=parseInt(Math.floor(Math.random()*4));
		var randY=parseInt(Math.floor(Math.random()*4));
		while(true){
			if(board[randX][randY]==0)
			break;
			randX=parseInt(Math.floor(Math.random()*4));
		    randY=parseInt(Math.floor(Math.random()*4));
		    times++;	
					}
		if (times>50) {
			for(var i=0;i<4;i++){
				for(var j=0;j<4;j++){
					if(board[i][j]==0){
						randX=i;
						randY=j;
					}
				}
			}
		}
		//生成随机数
		var randNumber=Math.random()>0.5?2:4;
		//使随机数在随机位置
		board[randX][randY]=randNumber;
		showNumberWithAnimation(randX,randY,randNumber);
		
	
		return true;
}

function moveLeft(){
	if(!canMoveLeft(board))
		return false;


	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				for(var k=0;k<j;k++){
					if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;

					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && hasConflict[i][j]==false){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k]+=board[i][j];
						board[i][j]=0;

						//score
						score+=board[i][k];
						updataScore(score);

						hasConflict[i][k]=true;
						continue;
					}
				}
			}
		}
	
	
	setTimeout('updateBoardView()',200);
	return true;
	
}

function moveRight(){
	if(!canMoveRight(board))
		return false;


	for(var i=0;i<4;i++)
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){

						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;

					}else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board) && hasConflict[i][j]==false){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//add
						//score
						score+=board[i][k];
						updataScore(score);

						hasConflict[i][k]=true;
						continue;
					}
				}
			}
		}
	
	
	setTimeout('updateBoardView()',200);
	return true;
	
}
function moveUp(){
	if(!canMoveUp(board))
		return false;


	for(var j=0;j<4;j++)
		for(var i=1;i<4;i++){
			if(board[i][j]!=0){
				for(var k=0;k<i;k++){
					if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;

					}else if(board[k][j]==board[i][j] && noBlockVertical(j,k,i,board) && hasConflict[i][j]==false){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						//add
						//score
						score+=board[k][j];
						updataScore(score);

						hasConflict[k][j]=true;
						continue;
					}
				}
			}
		}
	
	
	setTimeout('updateBoardView()',200);
	return true;
	
}
function moveDown(){

	if(!canMoveDown(board))
		return false;


	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				for(var k=3;k>i;k--){
					if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j] && noBlockVertical(j,i,k,board) && hasConflict[i][j]==false){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						//add
						//score
						score+=board[k][j];
						updataScore(score);

						hasConflict[k][j]=true;
						continue;
					}
				}
			}
		}
	setTimeout('updateBoardView()',200);
	return true;
}
$(document).keydown(function(event) {

	switch(event.keyCode){
		case 37://left
		event.preventDefault();
		if(moveLeft()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
		}
		break;

		case 38://up
		event.preventDefault();
		if(moveUp()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
		}
		break;

		case 39://right
		event.preventDefault();
		if(moveRight()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
		}
		break;

		case 40://down
		event.preventDefault();
		if(moveDown()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
		}
		break;
		default:
		break;
	}
});

document.addEventListener("touchstart",function(event){
	startX=event.touches[0].pageX;
	startY=event.touches[0].pageY;
});
document.addEventListener("touchmove",function(event){
	event.preventDefault();
});
document.addEventListener("touchend",function(event){
	 endX=event.changedTouches[0].pageX;
	 endY=event.changedTouches[0].pageY;

	var gapX=endX-startX;
	var gapY=endY-startY;
	if(Math.abs(gapX)<0.1*documentWidth && Math.abs(gapY)<0.1*documentWidth){
		return;
	}

	if(Math.abs(gapX)>Math.abs(gapY)){ //左右
		if(gapX>0){
			//right
			if(moveRight()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
        	}
			
		}else{
			//LEFT
		if(moveLeft()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
        	}
        }
	}else{
		if(gapY>0){
			//down
			if(moveDown()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
        }	
	}else{
			//up
			if(moveUp()){
			setTimeout("generateOneNumber()",210);
            setTimeout("isGameOver()",300);
			}
		}
	}
});

	

