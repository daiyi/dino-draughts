var EMPTY = 0;
var LIGHT = 1;
var DARK = 2;
var LIGHT_KING = 3;
var DARK_KING = 4;

var game = new CheckerGame();
initializeGame(game);

function CheckerGame() {
  this.board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
  ];

}

function initializeGame(game) {
  var fitBoardToWindow = fitToWindowRatio('.board',  1);
  fitBoardToWindow();
  $(window).resize(fitBoardToWindow);
  drawBoard(game);
  drawPieces(game);
}

function drawBoard(game) {
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
      if ((x + y) % 2 == 1) {
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

function drawPieces(game) {
  console.log('drawing pieces');
  var graphicBoard = game.graphicBoard;
  var board = game.board;

  for (var y = 0; y < board.length; y++) {
    for (var x = 0; x < board.length; x++) {
      var piece = board[y][x];

      if (piece != EMPTY) {
        var $piece = $('<div>', { class: 'piece'});
        switch (piece) {
          case LIGHT_KING:

          case LIGHT:
            $piece.addClass('.piece-light');
            break;

          case DARK_KING:

          case DARK:
            $piece.addClass('.piece-dark');
            break;
        }
        graphicBoard[y][x].append($piece);
      }

    }
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
