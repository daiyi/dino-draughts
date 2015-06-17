var EMPTY = 0;
var LIGHT = 1;
var DARK = -1;
var LIGHT_KING = 2;
var DARK_KING = -2;

var game = new CheckerGame();
initializeGame(game);

function CheckerGame() {
  this.board = [
    [ 0, 1, 0, 1, 0, 1, 0, 1],
    [ 1, 0, 1, 0, 1, 0, 1, 0],
    [ 0, 1, 0, 1, 0, 1, 0, 1],
    [ 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0, 0],
    [-1, 0,-1, 0,-1, 0,-1, 0],
    [ 0,-1, 0,-1, 0,-1, 0,-1],
    [-1, 0,-1, 0,-1, 0,-1, 0]
  ];
  this.graphicBoard;
  this.player = DARK;

  // a dom object referencing the piece selected to move
  this.pieceSelected;

  // array of dom object referencing 'squares' on game board for piece to move to
  this.moveStack = [];
}

function initializeGame(game) {
  var fitBoardToWindow = fitToWindowRatio('.board',  1);
  fitBoardToWindow();
  $(window).resize(fitBoardToWindow);
  drawBoard();
  drawPieces(pieceSelection);

  $(document).keyup(function(e) {
    switch (e.which) {
      // 'enter'
      case 13:
        console.log('pressed enter');
        executeTurn();
        break;
      // 'backspace'
      case 8:
        console.log('pressed backspace');
      // 'esc'
      case 27:
        console.log('pressed esc');
      // 'del'
      case 46:
        console.log('pressed del');
        resetBoard();
    }
  });
}

function drawBoard() {
  var board = game.board;
  var graphicBoard = [];
  var unitLength = board.length;
  var squareRatio = 1.0 / unitLength;

  for (var y = 0; y < unitLength; y++) {
    graphicBoard.push([]);
    for (var x = 0; x < unitLength; x++) {

      // todo: squares have sensible min-width
      var $square = $('<div>', { class: 'square',
                                 width: squareRatio * 100 + '%',
                                 height: squareRatio * 100  + '%',
                                 'data-x': x,
                                 'data-y': y });
      if ((x + y) % 2) {
        $square.addClass('square-dark');
      }
      else {
        $square.addClass('square-light');
      }
      $('.board').append($square);
      graphicBoard[y].push($square);
    }
  }
  game.graphicBoard = graphicBoard;
}

function resetBoard() {
  $('.square').removeClass('selected');
  pieceSelection();
  game.pieceSelected = null;
  game.moveStack = [];
}

function drawPieces(callback) {
  var graphicBoard = game.graphicBoard;
  var board = game.board;
  resetBoard();
  console.log('drawing pieces!');

  for (var y = 0; y < board.length; y++) {
    for (var x = 0; x < board.length; x++) {
      var piece = board[y][x];

      if (piece != EMPTY) {
        var $piece = $('<div>', { class: 'piece'});
        switch (piece) {
          case LIGHT_KING:
            // TODO
          case LIGHT:
            $piece.addClass('piece-light');
            break;
          case DARK_KING:
            // TODO
          case DARK:
            $piece.addClass('piece-dark');
            break;
        }
        graphicBoard[y][x].html($piece);
      }
    }
  }
  if (callback) {
    callback();
  }
}

function pieceSelection() {
  console.log('.piece-' + pieceCodeToColor(game.player));
  $('.piece-' + pieceCodeToColor(game.player)).parent().click(pieceSelected);
}

function pieceSelected(e) {
  game.pieceSelected = e.target;
  game.moveStack.push(e.target);
  highlightSquare(e.target);
  $('.piece').parent().unbind('click');
  squareSelection();
}

function squareSelection() {
  console.log('squareSelection');
  squares = validMoves(game.moveStack, game.pieceSelected);
  squares.forEach(function($square){
    console.log('highlighting squares');
    $square.click(squareSelected);
  });
}

function squareSelected(e) {
  game.moveStack.push(e.target);
  highlightSquare(e.target);
  $('.square').unbind('click');

  // if last move was jump, allow another move
  if (Math.abs(game.moveStack[game.moveStack.length-2].dataset.y - e.target.dataset.y) == 2) {
    squareSelection();
  }
}

function highlightSquare(target) {
  console.log(target);
  var $target = $(target);
  if ($target.hasClass('piece')) {
    $target = $target.parent();
  }
  $target.addClass('selected');
}

function executeTurn() {
  // notate changes on game.board
  // - remove captured pieces

  // switch to other player's turn
  game.player += -1;

  // draw board

  // if any player has no pieces, game over

  // if player can't move, game over
}

// returns an array of jquery objects of squares that are valid moves
function validMoves(moveStack, piece) {
  var possibleMoveSquares = [];
  var fromSquare;
  var board = game.board;
  var graphicBoard = game.graphicBoard;
  var move = game.player;
  var $from = $(moveStack[moveStack.length-1]).parent();

  var x = $from.data('x');
  var y = $from.data('y');
  console.log(x);
  console.log(y);

  // TODO clean this code it is literally the worst but I am low on time ): ):
  if (isOnBoard(y + move)) {
    console.log('forwards true');
    if (isOnBoard(x + 1)) {
      console.log('right true');
      if (board[y+move][x+1] == EMPTY) {
        console.log('empty');
        possibleMoveSquares.push(graphicBoard[y+move][x+1]);
      }
      // can we hop?
      else if ((board[y+move][x+1] != game.player) && isOnBoard(y + move*2) && isOnBoard(x + 2) && board[y+move*2][x+2] == EMPTY) {
        console.log('hop');
        possibleMoveSquares.push(graphicBoard[y+move*2][x+2]);
      }
    }
    if (isOnBoard(x - 1)) {
      console.log('left true');
      if (board[y+move][x-1] == EMPTY) {
        console.log('empty');
        possibleMoveSquares.push(graphicBoard[y+move][x-1]);
      }
      // can we hop?
      else if ((board[y+move][x-1] != game.player) && isOnBoard(y + move*2) && isOnBoard(x - 2) && board[y+move*2][x-2] == EMPTY) {
        console.log('hop');
        possibleMoveSquares.push(graphicBoard[y+move*2][x-2]);
      }
    }
  }
  // TODO if king, add possible backward squares
  return possibleMoveSquares;
}

// returns true if z is valid x or y coordinate on board
function isOnBoard (z) {
  return (z < game.board.length) && (z >= 0);
}

function pieceCodeToColor(code) {
  switch (code) {
    case EMPTY:
      return 'empty';
    case LIGHT_KING:
    case LIGHT:
      return 'light';
    case DARK_KING:
    case DARK:
      return 'dark';
  }
}

function pieceCodeToClass(code) {
  switch (code) {
    case EMPTY:
      return '';
    case LIGHT_KING:
      return 'piece-light-king';
    case LIGHT:
      return 'piece-light';
    case DARK_KING:
      return 'piece-dark-king';
    case DARK:
      return 'piece-dark';
  }
}

function fitToWindowRatio(selector,  ratio) {
  function fitToRatio(e) {
    var length = Math.floor(Math.min($(window).height(),  $(window).width()) * ratio);
    $(selector).width(length);
    $(selector).height(length);
  }
  return fitToRatio;
}
