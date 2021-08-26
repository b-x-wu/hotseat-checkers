import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={"square " + props.color + props.pieceColor}
      id={props.id}
      onClick={props.onClick}
    >
      {props.piece}
    </button>
  );
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pieces: (() => {
        let ret = Array(8).fill(Array(4).fill(null));
        ret[0] = Array(4).fill('R');
        ret[1] = Array(4).fill('R');
        ret[2] = Array(4).fill('R');
        ret[5] = Array(4).fill('B');
        ret[6] = Array(4).fill('B');
        ret[7] = Array(4).fill('B');

        // ret[2] = [null, null, 'R', null];
        // ret[4] = [null, null, 'R', null];

        return ret;
      })(),
      selected: null,
      doubleJumping: false,
      turn: 'B'
    }
  }

  // NOTE: a checker's square is white iff when it is
  // in the ith row and jth column, i and j are both odd,
  // that is i - j % 2 === 0

  jumpToEmptySquare(i, j) { // TODO: no kings yet
    let dir = this.state.turn === "B" ? -1 : 1;
    if (!((i - j) % 2 === 0) & !this.state.pieces[i][Math.floor(j / 2)]) {
      if (this.state.selected[0] + dir === i & (
        (this.state.selected[1] - 1 === j) || 
        (this.state.selected[1] + 1 === j)
      )) {
        return true;
      }
      return false;
    }
    return false;
  }

  jumpOverPiece(i, j) {
    let dir = this.state.turn === "B" ? -1 : 1;

    if (!((i - j) % 2 === 0) & !this.state.pieces[i][Math.floor(j / 2)] & i === this.state.selected[0] + (2 * dir)) {
      let piece = this.state.pieces[this.state.selected[0]][Math.floor(this.state.selected[1] / 2)];
      let other_piece = piece === 'B' ? 'R' : 'B';
      if (j === this.state.selected[1] + 2 & this.state.pieces[i - dir][Math.floor((j - 1) / 2)] === other_piece) {
        return [i - dir, j - 1];
      } else if (j === this.state.selected[1] - 2 & this.state.pieces[i - dir][Math.floor((j + 1) / 2)] === other_piece) {
        return [i - dir, j + 1];
      }
      return null;
    }
    return null
  }

  canJumpOverPiece() {

    let dir = this.state.turn === "B" ? -1 : 1;

    let i = this.state.selected[0];
    let j = this.state.selected[1];

    if ([0, 1].includes(i)) {
      return false;
    }

    let piece = this.state.pieces[i][Math.floor(j / 2)];
    let other_piece = piece === 'B' ? 'R' : 'B';

    let canJumpOverLeftPiece = this.state.pieces[i + dir][Math.floor((j - 1) / 2)] === other_piece & this.state.pieces[i + (2 * dir)][Math.floor((j - 2) / 2)] === null;
    let canJumpOverRightPiece = this.state.pieces[i + dir][Math.floor((j + 1) / 2)] === other_piece & this.state.pieces[i + (2 * dir)][Math.floor((j + 2) / 2)] === null;
  
    return canJumpOverLeftPiece || canJumpOverRightPiece;

  }

  handleClick(i, j) {
    
    if (this.state.selected) {
      // there's already a piece selected
      // if the user clicked the same piece, deselect it
      if (i === this.state.selected[0] & j === this.state.selected[1]) {
        this.setState({
          selected: null
        });
        if (this.state.doubleJumping) {
          this.setState({
            doubleJumping: false,
            turn: this.state.turn === "B" ? "R" : "B"
          })
        }
      } else if (this.jumpToEmptySquare(i, j) & !this.state.doubleJumping) {
        
        let pieces = this.state.pieces.slice();
        let piece = pieces[this.state.selected[0]][Math.floor(this.state.selected[1] / 2)]
        pieces[this.state.selected[0]][Math.floor(this.state.selected[1] / 2)] = null;
        let row = pieces[i].slice();
        row[Math.floor(j / 2)] = piece;
        pieces[i] = row;

        this.setState({
          pieces: pieces,
          selected: null,
          turn: this.state.turn === "B" ? "R" : "B"
        });

      } else if (this.jumpOverPiece(i, j)) {

        let jumpedOverPiece = this.jumpOverPiece(i, j);
        let pieces = this.state.pieces.slice();
        let piece = pieces[this.state.selected[0]][Math.floor(this.state.selected[1] / 2)];
        pieces[this.state.selected[0]][Math.floor(this.state.selected[1] / 2)] = null;
        let row = pieces[i].slice();
        row[Math.floor(j / 2)] = piece;
        pieces[i] = row;
        pieces[jumpedOverPiece[0]][Math.floor(jumpedOverPiece[1] / 2)] = null;

        this.setState({
          pieces: pieces,
          selected: [i, j]
        }, () => {
          if (this.canJumpOverPiece()) {
            this.setState({
              selected: [i, j],
              doubleJumping: true
            });
          } else {
            this.setState({
              selected: null,
              doubleJumping: false,
              turn: this.state.turn === "B" ? "R" : "B"
            })
          }
        });

      }
    } else {
      if ((i - j) % 2 === 0) {
        // the square is white
        return;
      } else if (this.state.pieces[i][Math.floor(j / 2)] === this.state.turn) {
        this.setState({selected: [i, j]});
      }
    }
  }

  render() {
    let rows = [];
    for (let i = 0; i < 8; i++) { // TODO: this is terribly inefficient
      rows.push([]);
      if (i % 2 === 0) {
        for (let j = 0; j < 8; j++) {
          if (j % 2 === 0) {
            rows[i].push(<Square 
              key={i + "," + j} 
              color="white" 
              pieceColor="" 
              piece=""
              onClick={() => this.handleClick(i, j)}
              id=""
            />);
          } else {
            rows[i].push(<Square 
              key={i + "," + j} 
              color="black" 
              pieceColor="" 
              piece=""
              onClick={() => this.handleClick(i, j)}
              id=""
            />);
          }
        }
      } else {
        for (let j = 0; j < 8; j++) {
          if (j % 2 === 0) {
            rows[i].push(<Square 
              key={i + "," + j} 
              color="black" 
              pieceColor="" 
              piece=""
              onClick={() => this.handleClick(i, j)}
              id=""
            />);
          } else {
            rows[i].push(<Square 
              key={i + "," + j} 
              color="white" 
              pieceColor="" 
              piece=""
              onClick={() => this.handleClick(i, j)}
              id=""
            />);
          }
        }
      }
    }

    for (let i = 0; i < 8; i++) { // TODO: this is so ineffecient, my god
      for (let j = 0; j < 4; j++) {
        if (this.state['pieces'][i][j] === 'R') {
          if (i % 2 === 0) {
            rows[i][2 * j + 1] = React.cloneElement(
              rows[i][2 * j + 1],
              {
                pieceColor: " red-piece",
                piece: "O"
              }
            )
          } else {
            rows[i][2 * j] = React.cloneElement(
              rows[i][2 * j],
              {
                pieceColor: " red-piece",
                piece: "O"
              }
            )
          }
        } else if (this.state['pieces'][i][j] === 'B') {
          if (i % 2 === 0) {
            rows[i][2 * j + 1] = React.cloneElement(
              rows[i][2 * j + 1],
              {
                pieceColor: " black-piece",
                piece: "O"
              }
            )
          } else {
            rows[i][2 * j] = React.cloneElement(
              rows[i][2 * j],
              {
                pieceColor: " black-piece",
                piece: "O"
              }
            )
          }
        }
      }
    }

    if (this.state.selected) {
      rows[this.state.selected[0]][this.state.selected[1]] = React.cloneElement(
        rows[this.state.selected[0]][this.state.selected[1]],
        {
          id: "selected"
        }
      )
    }

    rows = rows.map((x, idx) => (<div key={idx} className="board-row">{x}</div>));

    return (
      <div>
        {rows}
        <p>
          {this.state.turn === "B" ? "Black Turn" : "Red Turn"}
        </p>
      </div>
    )
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
