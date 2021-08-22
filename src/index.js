import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + props.color + props.pieceColor}>
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
        return ret;
      })(),
    }
  }

  render() {
    let rows = [];
    for (let i = 0; i < 8; i++) { // TODO: this is terribly inefficient
      rows.push([]);
      if (i % 2 === 0) {
        for (let j = 0; j < 8; j++) {
          if (j % 2 === 0) {
            rows[i].push(<Square key={i + "," + j} color="white" pieceColor="" piece=""/>);
          } else {
            rows[i].push(<Square key={i + "," + j} color="black" pieceColor="" piece=""/>);
          }
        }
      } else {
        for (let j = 0; j < 8; j++) {
          if (j % 2 === 0) {
            rows[i].push(<Square key={i + "," + j} color="black" pieceColor="" piece=""/>);
          } else {
            rows[i].push(<Square key={i + "," + j} color="white" pieceColor="" piece=""/>);
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

    rows = rows.map((x, idx) => (<div key={idx} className="board-row">{x}</div>));

    return (
      <div>
        {rows}
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
