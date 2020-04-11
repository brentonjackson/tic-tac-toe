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
  margin: 0 1em;
  padding: 0.25em 1em;
`

const SquareButton = styled.button`
  background: #fff;
  border: 1px solid dodgerblue;
  color: dodgerblue;
  float: left;
  font-size: 50px;
  font-weight: bold;
  line-height: 34px;
  height: 100px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 100px;

  &:focus {
    outline: none;
  }
`

const StatusDiv = styled.div`
  
  font-size: 20px;
  font-weight: bold;
  background: papayawhip;
  border-radius: 5px;
  
`
// Components =====================================================

// function component since it doesn't have state
function Square(props) {
    return (
        <SquareButton className="square" onClick = {props.onClick}>
        {props.value}
        </SquareButton>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return(
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
          <div>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
        );
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
        status = `Winner: ${winner}!`;
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <StatusDiv>{ status }</StatusDiv>
          <ol>{ moves }</ol>
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
            return squares[b];
        }
    }
    return null;
}