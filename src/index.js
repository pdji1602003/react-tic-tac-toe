import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Square extends React.Component {
	render() {
		return (
			<button
				className="square"
				onClick={() => this.props.onClick()}
			>
				{this.props.value}
			</button>
		);
	}
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>)
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
		super(props)
		this.state = {
			history:[{
				squares:Array(9).fill(null)
			}], 
			stepNumber:0,
			xIsNext:true
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1) 
		const current = history[history.length - 1]
		const squares = current.squares.slice() //squares本身是個array
		
		if (calculateWinner(squares) || squares[i]) return
		squares[i] = this.state.xIsNext ? 'X' : 'O'
		this.setState({
			history:history.concat([{
				squares:squares
			}]),
			stepNumber:history.length,
			xIsNext: !this.state.xIsNext
		})
	}

	jumpTo(step){
		this.setState({
			stepNumber:step, 
			xIsNext:(step % 2) === 0
		})
	}


	render() {
		const history = this.state.history
		const current = history[this.state.stepNumber]
		const winner = calculateWinner(current.squares)
		let status
		if(winner){//若已得winner的結果，則將winner的值賦給status
			status = 'Winner: ' + winner
		} else {
			status = 'Next player: ' + (this.state.xIsNext ?'X' : 'O')
		}

		const moves = history.map((step, move) => {
			const desc = move? 'Go to move#' + move: 'Go to game start'
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		})

		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
)

// 可參考這裡的解釋：👉🏻https://jsfiddle.net/nh_codes/tyck2j64/
function calculateWinner(squares) {
	// 將所有贏的組合記錄在lines裡
	// [0, 1, 2]意思是說，檢查position在0, 1, 2，若三個值一樣，在此此值為贏家
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]//以destructuring取得在在lines裡值為1, 2, 3...9的array 
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { //檢查在該位置的值是否都相同，若都相同的話，返回該值(此值就是贏家)
			return squares[a]
		}
	}
	return null
}




