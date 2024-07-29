import React, { useState, useEffect } from 'react';
import Board from './Board';
import { useNavigate } from "react-router-dom";
const getRandomTile = () => {
    const value = Math.random() < 0.9 ? 2 : 4;
    return value;
};

const initializeBoard = () => {
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
};
let gameOver = false;
const addRandomTile = (board) => {
    const emptyTiles = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyTiles.push([row, col]);
            }
        }
    }
    if (emptyTiles.length > 0) {
        const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]; //bắt ra 1 ô random
        board[row][col] = getRandomTile(); //gán vô cho 1 số
    }
    if (emptyTiles.length === 0) {
        gameOver = true;
    }

};

const mergeRowLeft = (row) => {
    let newRow = row.filter(value => value !== 0); // bỏ hết cmnl ô nào trống
    for (let i = 0; i < newRow.length - 1; i++) { // gộp ô
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            newRow[i + 1] = 0;
        }
    }
    newRow = newRow.filter(value => value !== 0);
    while (newRow.length < 4) {
        newRow.push(0);
    }
    return newRow;
};

const moveLeft = (board) => {
    const newBoard = board.map(row => mergeRowLeft(row));
    return newBoard;
};

const moveRight = (board) => {
    const newBoard = board.map(row => mergeRowLeft(row.reverse()).reverse());
    return newBoard;
};

const moveUp = (board) => {
    const transposedBoard = transpose(board);
    const newBoard = moveLeft(transposedBoard);
    return transpose(newBoard);
};

const moveDown = (board) => {
    const transposedBoard = transpose(board);
    const newBoard = moveRight(transposedBoard);
    return transpose(newBoard);
};

const transpose = (board) => {
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            newBoard[col][row] = board[row][col];
        }
    }
    return newBoard;
};

const Game2048 = () => {
    const [board, setBoard] = useState(initializeBoard());
    const navigate = useNavigate();
    const handleKeyPress = (e) => {
        let newBoard;
        if (e.key === 'ArrowLeft') {
            newBoard = moveLeft(board);
        } else if (e.key === 'ArrowRight') {
            newBoard = moveRight(board);
        } else if (e.key === 'ArrowUp') {
            newBoard = moveUp(board);
        } else if (e.key === 'ArrowDown') {
            newBoard = moveDown(board);
        } else {
            return;
        }

        if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
            addRandomTile(newBoard);
            setBoard(newBoard);
        }
    };

    const resetGame2048 = () => {
        setBoard(initializeBoard());
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [board]);
    const goBackToMenu = () => {
        navigate("/");
    };
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>2048</h1>
            <Board board={board} />
            <button className='block-back-button' onClick={resetGame2048} style={{ display: 'block', margin: '20px auto' }}>
                Reset
            </button>
            {gameOver && <div className="block-stacking-game-over-2048">Game Over</div>}
            <button onClick={goBackToMenu} className="block-back-button th-button">
                Home
            </button>
        </div>
    );
};

export default Game2048;


