import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import styled from 'styled-components'

// STYLES ===========================================================
const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid dodgerblue;
  color: dodgerblue;
  margin: 0;
  padding: 0.25em 1em;
  font-family: Roboto;
  font-size: 20px;
  cursor: pointer;

  @media (min-width: 375px) {
    font-size: 25px;
  }
  @media (min-width: 750px) {
    font-size: 50px;
  }
  @media (min-width: 1200px) {
    font-size: 30px;
  }


  &:focus {
    border: 3.5px solid dodgerblue;
`

const SquareButton = styled.button`
  background: #fff;
  border: 1px solid dodgerblue;
  color: dodgerblue;
  float: left;
  font-size: 65px;
  font-weight: bold;
  height: 90px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 90px;

  @media (min-width: 375px) {
    width: 100px;
    height: 100px;
  }
  @media (min-width: 413px) {
    width: 120px;
    height: 120px;
  }
  @media (min-width: 750px) {
    width: 200px;
    height: 200px;
    font-size: 120px;
    line-height: 34px;
  }
  @media (min-width: 1200px) {
    font-size: 100px;
    width: 150px;
    height: 150px;
  }

  &:focus {
    outline: none;
  }
`

const StatusDiv = styled.div`

  font-size: 25px;
  background: papayawhip;
  border-radius: 5px;
  padding: 10px 1px;


  @media (min-width: 375px) {
    font-size: 30px;
  }
  @media (min-width: 750px) {
    padding: 5px;
    font-size: 60px;
  }
  @media (min-width: 1200px) {
    padding: 5px;
    font-size: 40px;
  }

`
// Components =====================================================

// function component since it doesn't have state
function Square(props) {
    return (
        <SquareButton className={"square " + (props.isWinning ? "square--winning" : null)} onClick = {props.onClick}>
        {props.value}
        </SquareButton>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return(
            <Square
              isWinning={this.props.winningSquares.includes(i)}
              key={"square " + i}
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquares(n) {
    let squares = [];
    for (let i = n; i < n + 3; i++) {
      squares.push(this.renderSquare(i));
    }
    return squares;
    }

    renderRows(i) {
      return (
        <div className="board-row">
          {this.renderSquares(i)}
        </div>
      );
    }

    render() {
    return (
      <div>
        {this.renderRows(0)}
        {this.renderRows(3)}
        {this.renderRows(6)}
      </div>
    );
  }
}


class Score extends React.Component {
  state = {
    counter: 0,
  };

  onIncrement = () => {
    this.setState(state => ({ counter: state.counter + 1 }));
  }

  onDecrement = () => {
    this.setState(state => ({ counter: state.counter - 1 }));
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        history: [{
            squares: Array(9).fill(null)
        }],
        xIsNext: true,
        stepNumber: 0,
    }
  }

  handleClick(i) {
        const locations = [
          [1, 1],
          [2, 1],
          [3, 1],
          [1, 2],
          [2, 2],
          [3, 2],
          [1, 3],
          [2, 3],
          [3, 3]
        ];
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // copy of squares array
        const squares = current.squares.slice();

        // return early if there's a winner or if square already filled
        if(calculateWinner(squares) || squares[i]) {
            return ;
        }

        // toggle between x and o
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: locations[i]
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
  }

  jumpTo(step) {
      this.setState({
          // update step number
          stepNumber: step,
          // if number is even, x is next
          xIsNext: (step % 2) === 0,
      })
  }

  // sortHistory() {
  //   this.setState({
  //     isDescending: !this.state.isDescending
  //   });
  // }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            `Go to move # ${move}` :
            `Go to game start`;
        return (
            <li key={move}>
                <Button onClick={() => this.jumpTo(move)}> {desc} </Button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = `🎉🏆 Winner: ${winner.player}! 🏆🎉`;
        // if (winner === 'X') { ++; }
        // else if (winner ==='O') { oCount++; }
    } else if (!current.squares.includes(null)) {
        status = "🙂 It's a draw";
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }



    return (
      <div><div className="title">Tic Tac Toe!</div>
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <StatusDiv>{ status }</StatusDiv>
          <ol>{moves}</ol>
          {/*<ol>{ this.state.isDescending ? moves : moves.reverse() }</ol>*/}
{/*          <Button onClick={() => this.sortHistory()}>
            Sort by: {this.state.isDescending ? "Descending" : "Asending"}
          </Button>*/}
        </div>
      </div>
      </div>
    );
  }
}

// ========================================

ReactDom.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (( squares[a]  &&  (squares[a] === squares[b]))  && (squares[a] === squares[c])) {
            return { player: squares[a], line: [a, b, c] };
        }
    }
    return null;
}