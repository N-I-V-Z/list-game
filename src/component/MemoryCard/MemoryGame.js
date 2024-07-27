// src/MemoryGame.js
import React, { useState, useEffect } from 'react';
import './MemoryCard.css';
import Card from './Card';

const cardImages = [
    { src: '/img/th.jpg', matched: false },
    { src: '/img/th1.jpg', matched: false },
    { src: '/img/th2.jpg', matched: false },
    { src: '/img/th3.jpg', matched: false },
    { src: '/img/th4.jpg', matched: false },
    { src: '/img/th5.jpg', matched: false },
];

function MemoryGame() {
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);

    // Shuffle cards
    const shuffleCards = () => {
        const shuffledCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map(card => ({ ...card, id: Math.random() }));

        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffledCards);
        setTurns(0);
    };

    // Handle a choice
    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    };

    // Compare 2 selected cards
    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            if (choiceOne.src === choiceTwo.src) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if (card.src === choiceOne.src) {
                            return { ...card, matched: true };
                        } else {
                            return card;
                        }
                    });
                });
                resetTurn();
            } else {
                setTimeout(() => resetTurn(), 1000);
            }
        }
    }, [choiceOne, choiceTwo]);

    // Reset choices & increase turn
    const resetTurn = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns(prevTurns => prevTurns + 1);
        setDisabled(false);
    };

    // Start a new game automatically
    useEffect(() => {
        shuffleCards();
    }, []);

    return (
        <div className="MemoryGame">
            <h1>Memory Game</h1>
            <button onClick={shuffleCards}>New Game</button>

            <div className="card-grid">
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        handleChoice={handleChoice}
                        flipped={card === choiceOne || card === choiceTwo || card.matched}
                        disabled={disabled}
                    />
                ))}
            </div>
            <p>Turns: {turns}</p>
        </div>
    );
}

export default MemoryGame;
