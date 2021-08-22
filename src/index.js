import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + props.color}>
      O
    </button>
  );
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: (() => {
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
            rows[i].push(<Square key={i + "," + j} color="white" />);
          } else {
            rows[i].push(<Square key={i + "," + j} color="black" />);
          }
        }
      } else {
        for (let j = 0; j < 8; j++) {
          if (j % 2 === 0) {
            rows[i].push(<Square key={i + "," + j} color="black" />);
          } else {
            rows[i].push(<Square key={i + "," + j} color="white" />);
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
