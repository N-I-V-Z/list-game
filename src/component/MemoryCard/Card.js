// src/Card.js
import React from 'react';
import './MemoryCard.css';

function Card({ card, handleChoice, flipped, disabled }) {
    const handleClick = () => {
        if (!disabled) {
            handleChoice(card);
        }
    };

    return (
        <div className="card">
            <div className={flipped ? 'flipped' : ''}>
                <img className="front" src={card.src} alt="card front" />
                <img
                    className="back"
                    src="/img/pokemon_card.png"
                    alt="card back"
                    onClick={handleClick}
                />
            </div>
        </div>
    );
}

export default Card;
