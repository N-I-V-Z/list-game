import React from 'react';
import './Board.css';

const Board = ({ board }) => {
    return (
        <div className="board-2048">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="board-row-2048">
                    {row.map((cell, cellIndex) => (
                        <div
                            key={cellIndex}
                            className={`board-cell-2048 ${cell !== 0 ? 'filled' : ''}`}
                            data-value={cell}
                        >
                            {cell !== 0 ? cell : ''}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
