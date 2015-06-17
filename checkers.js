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
  this.graphicBoard;
  this.player = DARK;
  this.pieceSelected;
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

function resetBoard() {
  $('.square').removeClass('selected');
  pieceSelection();
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
  squareSelected(e);
  $('.piece').parent().unbind('click');
}

function squareSelected(e) {
  console.log(e.target);
  var $target = $(e.target);
  if ($target.hasClass('piece')) {
    $target = $target.parent();
  }
  $target.addClass('selected');
}

function executeTurn() {
  // notate changes on game.board

  // switch to other player's turn
  game.player = 3 - game.player;

  // draw board
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
