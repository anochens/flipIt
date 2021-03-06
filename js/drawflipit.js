/**
 * @author Ethan Heilman
 *
 **/


/**
 * Holds all the settings for the FlitItRenderEngine.
 *
 *
 * @param board  the board element which we draw on.
 *
 */
function RenderSettings( board ){

  this.board = board;
  this.numTicks = 1000; // length of game in turns
  this.xColor = "#0066CC"; // blue
  this.yColor = "#CC2200"; // red
  this.player = "X";
  this.fogOfWar = false;
  this.rightMargin = 8;
  this.feedback_type = 'FH';

}


/**
 * Responsible for drawing flip it games.
 *
 * new FlipItRenderEngine( new RenderSettings( $("board") ) ) 
 *
 * @param renderSettings  the settings for this object.
 *
 */
function FlipItRenderEngine( renderSettings ) {

  // Setup the object.
  var board = renderSettings.board;
  var numTicks = renderSettings.numTicks;

  var xColor = renderSettings.xColor; 
  var yColor = renderSettings.yColor; 

  var player = renderSettings.player;
  var fogOfWar = renderSettings.fogOfWar;

  var circleSize = board.width()/200;
  var rightMargin = renderSettings.rightMargin;

  this.xColor = xColor;
  this.yColor = yColor;


  /**
   * Sets up a new board. 
   **/
  this.newBoard = function(){
    this.revealed = numTicks; // reveal all 

    if ( fogOfWar ) this.revealed = 0; // hide all
  
  };

  /**
   * Given a list of the flips which have occured draws the state of the game.
   *
   * this.drawBoard( int, { int: string, int:string ...} )
   * 
   * ticks  current number of ticks/turns into the game (what turn is it).
   * flips  state of the game. { tick : ("X"|"Y") }
   **/
  this.drawBoard = function(ticks, flips){

    var context = board[0].getContext("2d");

    var h = board.height();
    var w = board.width();

    // maps ticks in the game state to x-coordines on the board
    var mapX = function( tick ){
        return (tick/numTicks) * ( w - rightMargin );
    };

    context.clearRect( 0, 0, w, h );

    var control = "X";
    var lastFlip = 0;

    var xIntervals = [];
    var yIntervals = [];

    for ( var tick = 0; tick < ticks; tick++ ) {
      if ( tick in flips ) {
        var x = mapX(tick);

        // When "the player" makes a move reveal the board. This only applies when fog is on.
        if ( flips[tick] == player && this.revealed < tick ) {
          this.revealed = tick;
        }

        if ( tick <= this.revealed ) { // Don't draw circles if hidden by fog of war.
          if ( flips[tick] == "Y" ) drawCircle( context, yColor, circleSize, x, h/4); 
          if ( flips[tick] == "X" ) drawCircle( context, xColor, circleSize,  x,  3*h/4); 
        } 

        if ( flips[tick] != control ) { // Control has been changed.
          if ( flips[tick] == "Y" ) xIntervals.push( [lastFlip, tick-1] );
          if ( flips[tick] == "X" ) yIntervals.push( [lastFlip, tick-1] );
          lastFlip = tick;
          control = flips[tick];
        }
      }
    }

    // Add final interval
    if( lastFlip < ticks ) {
      if ( control == "X" ) xIntervals.push( [lastFlip, ticks] );
      if ( control == "Y" ) yIntervals.push( [lastFlip, ticks] );
    }


    // Draw the intervals (chunks of controlled contigious territory)
    for ( var i in xIntervals ) {
      var interval = xIntervals[i]; 
      drawRect( context, mapX(interval[0]), h - h/3, mapX(interval[1]-interval[0]), -h/6, xColor);
    }
    for ( var i in yIntervals ) {
      var interval = yIntervals[i];
      drawRect( context, mapX(interval[0]), h/3, mapX(interval[1]-interval[0]), h/6, yColor );
    }

    // Draw the lines after each flip
    control = "X";
    for ( var tick in flips ) {
      if ( flips[tick] != control ){
        drawHLine( context, mapX(tick), h/3, h/3);
        control = flips[tick]; 
      }
    }

    // Draw fog of war as long as the game is still running
    if ( ( ticks != numTicks ) ) {
		 if(fogOfWar) {
			var x = this.revealed;
			var l = ticks - this.revealed;
			drawRect( context, mapX(x), h - h/3, mapX(l), -h/6, "grey");
			drawRect( context, mapX(x), h/3, mapX(l), h/6, "grey" );
		 }
    }

    drawHLine( context, mapX(ticks), h/3, h/3);

    drawArrow( context, 0, h/2, w, h/2 );
    drawHLine( context, 3, h/3, h/3 )
  };

	//this function fills in circules for the flips made at the 
	//end of the game that you did not see
	this.drawEnd = function(ticks, flips) {
		var context = board[0].getContext("2d");
		var w = board.width();
		var h = board.height();

		// maps ticks in the game state to x-coordines on the board
		var mapX = function( tick ){
			return (tick/numTicks) * ( w - rightMargin );
		};
		for ( var tick = 0; tick < ticks; tick++ ) {
			if ( tick in flips ) {
				var x = mapX(tick);
				if ( flips[tick] == "Y" ) drawCircle( context, yColor, circleSize, x, h/4); 
				if ( flips[tick] == "X" ) drawCircle( context, xColor, circleSize,  x, 3*h/4); 
			}
		}




	};
}

/**
 * Displays the current score.
 *
 * new ScoreBoard( $("element"),  color, color )
 *
 * @param scoreBoardElement   html element to write out to.
 * @param xColor  html color of the x player.
 * @param yColor  html color of the y player.
 *
 */
function ScoreBoard( scoreBoardElement, xColor, yColor ) {
	this.update = function(xScore, yScore) { 
		output = "";

		msg = "<h2 style='display:inline'>The game is now running.</h2>";
		if(!window.game.running) msg='';
		output += '<div id="countdown" style="text-align:left;min-height:50px;height:auto !important; height:50px;" >'+msg+'</div>';                              

		if(window.feedback_type == 'all' || window.feedback_type == 'FH') {
			output += "<b><font color="+xColor+">Blue:</font></b> "+xScore;
			output += " ";
			output += "<b><font color="+yColor+">Red:</font></b> "+yScore;
			output += " ";
			output += "<b><font color='black'>&nbsp;&nbsp;&nbsp;&nbsp;Difference:</font></b> "+ (xScore - yScore);
			output += "</br>";
		}
		if(window.feedback_type == 'all' || window.feedback_type == 'LM') {
			output += "<div style='text-align:left;width:500px;margin-left:auto;margin-right:auto'>";

			drawLMGame(xColor, yColor);

			output += "</div>"; 
		}

		scoreBoardElement.html(output);
	};
}

function getTimeElapsed() {
	output = '';

	output += "<b><font color='black'>Time elapsed:</font></b>";
	output += "<span id='clock'>";
	output += (window.game.ticks*window.game.msPerTick/1000);
	output += "</span> secs";
	return output;
}

//gets a GET parameter from the URL, must be of x=y format
function getParameterByName(name)
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}                     

function clearLMBoard() {
	var board = $('#gameBoard_LM_canvas');

	var context = board[0].getContext('2d');
	context.clearRect( 0, 0, board.width(), board.height() );
}

function drawLMGame(xColor, yColor, end) {
	var board = $('#gameBoard_LM_canvas');

	var context = board[0].getContext('2d');

	context.clearRect( 0, 0, board.width(), board.height() );

	center = board.width()/2;

	if(end && window.game) {
   	window.game.currX = window.game.numTicks;
	}


	//flip did not give back control to player
	if(!window.game.lastFlipGood) {
		if(window.game.currX > 0) {
			if(window.game.running) {
				setTimeout(function() {
					drawX(context, center-50, board.height()/2-50, 9.5, 'blue', 5);
					}, 250);
			}
			return;
		}
	}
	if(window.game.currX == 0) return;

	//draw the middle vertical bar
	//drawRect(context, center, 0, 1, board.height(), 'black')


	setTimeout(function() {
		center = board.width()/2;

		var mapLM = function( tick ){
			return (tick/window.game.numTicks) * ( board.width() );
		};     

		if(window.game.firstY-window.game.lastX == 0) return;

		blue_width = mapLM(window.game.firstY - window.game.lastX);
		red_width = mapLM(window.game.currX - window.game.firstY);

		if(blue_width <0 || red_width<0) return;



		//draw blue and red bars
		height = 25;
		adj_center = (board.width() - (red_width+blue_width))/2;
		x= adj_center;
		y = board.height()/2 - height/2;

		drawRect(context, x, y, blue_width, height, xColor);
		drawRect(context, x+blue_width+4, y, red_width, height, yColor);


		//draw the arrow below the bars
		drawArrow(context, x-5, y+height+10, x+blue_width+red_width+10, y+height+10);


		//draw the little red X's for missed opp flips
		for(i=1;i<window.game.yNumFlipsInArea;i++) {
			x = adj_center+blue_width+4 + 10 + 20*i;
			drawX(context, x, board.height()-20);
		}    


		//if(getParameterByName('useAdj')=='yes') {
		//	console.log('using adj');
		//	width = window.game.deltaOfDeltasAdj;
		//}                                            
		//for plotting the differences
		//height = 25;
		//x = center;
		//y = board.height()/2 - height/2
		//color = width > 0 ? 'green':'red';
		//drawRect(context, x, y, width, height, color);


	}, 250);      
}

/**
 * Canvas util functions
 *
 *
 */
function drawArrow(context, x1, y1, x2, y2){

  context.fillStyle = "black";
  context.lineWidth=2;
  //draw a line
  context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
  context.closePath();
  context.stroke();

  //draw the head
  var head_size = 7;
  context.moveTo(x2, y2);
  context.beginPath();
    context.lineTo(x2-head_size, y2-head_size);
    context.lineTo(x2-head_size, y2+head_size);
    context.lineTo(x2, y2);
  context.closePath();
  context.fill();  
}

function drawCircle(context, color, size, x, y){
  context.fillStyle = color;
  context.lineWidth=2;
  context.beginPath();
    context.arc(x, y, size, 0, Math.PI*2, true); 
  context.closePath();
  context.fill();
  context.stroke();
}

function drawRect(context, x, y, w, h, color) {
  context.fillStyle = color;
  context.lineWidth=2;

  context.beginPath();
    context.rect( x, y, w, h );
  context.closePath();
  context.fill();
  context.stroke();
}

// Draws a horizontal line starting a the point (x, y) of length l
function drawHLine(context, x, y, l) {

  // firefox does not render lines with large widths correctly
  var line_fix = 0;
  var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if ( is_firefox ){
    line_fix = 2;
  }

  context.lineWidth= 5;

  context.beginPath();
    context.moveTo(x, y + line_fix);
    context.lineTo(x, y + l - line_fix);
  context.closePath();
  context.stroke();
}


function drawX(context, x, y, scale, color, linewidth){
	if(!scale) scale = 1;
	if(!color) color = 'red';
	if(!linewidth) linewidth = 1;

	size = 10*scale;

	context.fillStyle = color;
	context.strokeStyle = color;
	context.lineWidth=1+linewidth;
	//draw a line
	context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x+size, y+size);
	context.closePath();
	context.stroke();

	context.beginPath();
		context.moveTo(x+size, y);
		context.lineTo(x, y+size);
	context.closePath();
	context.stroke();
	context.strokeStyle = 'black';
}
