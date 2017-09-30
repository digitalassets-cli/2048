
function showNumberWithAnimation(i,j,randNumber){
 	var newgrid=$('#number-cell-'+i+'-'+j);
 	newgrid.css('color', getNumberColor(randNumber));
 	newgrid.css('background-color', getNumberBackgroundColor(randNumber));
 	newgrid.text(randNumber);


 	newgrid.animate({width:cellSideLength, height:cellSideLength,top:getPosTop(i,j),left:getPosLeft(i,j)}, 100);
 }

function showMoveAnimation(fromx,fromy,tox,toy){
	var cellnew=$('#number-cell-'+fromx+'-'+fromy);
	cellnew.animate({top:getPosTop(tox,toy), left:getPosLeft(tox,toy)}, 200);
}
function updataScore(score){
	$("#score").text(score);
}