import React, { useEffect, useRef, useState } from "react";
import "./DoodleJump.css";

const DoodleJump = () => {
    const canvasRef = useRef(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const animationRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        let boardWidth = 480; // Adjusted width
        let boardHeight = 720; // Adjusted height

        // Doodler
        let doodlerWidth = 46;
        let doodlerHeight = 46;
        let doodlerX = boardWidth / 2 - doodlerWidth / 2;
        let doodlerY = (boardHeight * 7) / 8 - doodlerHeight;
        let doodlerRightImg = new Image();
        let doodlerLeftImg = new Image();
        let doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width: doodlerWidth,
            height: doodlerHeight,
        };

        // Physics
        let velocityX = 0;
        let velocityY = -5; // The jump speed
        let gravity = 0.2; // Adjusted gravity to jump

        // Platforms
        let platformArray = [];
        let platformWidth = 60;
        let platformHeight = 18;
        let platformImg = new Image();
        let tempPlatformImg = new Image(); // Image for special platforms

        // Load images
        // doodlerRightImg.src = "https://firebasestorage.googleapis.com/v0/b/hellomilkyshop-4cf00.appspot.com/o/image_games%2Fdoodler-right.png?alt=media&token=fa02e1bc-c46b-43e8-b2a6-8d0fcbc6162e";
        // doodlerLeftImg.src = "https://firebasestorage.googleapis.com/v0/b/hellomilkyshop-4cf00.appspot.com/o/image_games%2Fdoodler-left.png?alt=media&token=cf93360a-8672-4adb-a813-c611fea2b600";
        platformImg.src = "https://firebasestorage.googleapis.com/v0/b/hellomilkyshop-4cf00.appspot.com/o/image_games%2Fplatform.png?alt=media&token=528e2eab-b6df-4f07-9133-42e899801f51";
        tempPlatformImg.src = "https://firebasestorage.googleapis.com/v0/b/hellomilkyshop-4cf00.appspot.com/o/image_games%2Fplatform-broken.png?alt=media&token=dfc2724b-78d0-4200-b72f-37cd73ad7eb1";
        doodlerRightImg.src = "https://firebasestorage.googleapis.com/v0/b/hellomilkyshop-4cf00.appspot.com/o/image_games%2F137903189-removebg-preview.png?alt=media&token=9d95019f-755f-43dc-8c3c-94aae7eaff90";
        doodlerLeftImg.src = "https://firebasestorage.googleapis.com/v0/b/hellomilkyshop-4cf00.appspot.com/o/image_games%2F137903189-removebg-preview.png?alt=media&token=9d95019f-755f-43dc-8c3c-94aae7eaff90";


        doodlerRightImg.onload = () => {
            context.drawImage(
                doodler.img,
                doodler.x,
                doodler.y,
                doodler.width,
                doodler.height
            );
        };

        const placePlatforms = () => {
            platformArray = [];

            let platform = {
                img: platformImg,
                x: boardWidth / 2,
                y: boardHeight - 50,
                width: platformWidth,
                height: platformHeight,
                isSpecial: false,
                steppedOn: false,
            };

            platformArray.push(platform);

            for (let i = 1; i < 6; i++) {
                let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));
                let previousPlatformY = platformArray[i - 1].y;
                let minY = previousPlatformY - 80; // Minimum distance between platforms
                let maxY = previousPlatformY - 100; // Maximum distance between platforms
                let randomY = Math.random() * (maxY - minY) + minY; // Ensure platforms are within this range
                let isSpecial = Math.random() < 0.3; // Adjust the probability as needed
                let platform = {
                    img: isSpecial ? tempPlatformImg : platformImg,
                    x: randomX,
                    y: randomY,
                    width: platformWidth,
                    height: platformHeight,
                    isSpecial: isSpecial,
                    steppedOn: false,
                };
                platformArray.push(platform);
            }
        };

        const newPlatform = () => {
            let randomX = Math.floor(Math.random() * (boardWidth - platformWidth));
            let previousPlatformY = platformArray[platformArray.length - 1].y;
            let minY = previousPlatformY - 80; // Minimum distance between platforms
            let maxY = previousPlatformY - 100; // Maximum distance between platforms
            let randomY = Math.random() * (maxY - minY) + minY; // Ensure platforms are within this range
            let isSpecial = Math.random() < 0.3; // Adjust the probability as needed
            let platform = {
                img: isSpecial ? tempPlatformImg : platformImg,
                x: randomX,
                y: randomY,
                width: platformWidth,
                height: platformHeight,
                isSpecial: isSpecial,
                steppedOn: false,
            };

            platformArray.push(platform);
        };

        const detectCollision = (a, b) => {
            return (
                a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y
            );
        };

        const updateScore = () => {
            setScore((prevScore) => prevScore + 5);
        };

        const renderGameOver = () => {
            context.fillStyle = "black";
            context.font = "20px sans-serif";
            context.fillText(
                "Game Over: Press 'Space' to Restart",
                boardWidth / 7,
                (boardHeight * 7) / 8
            );
        };

        const update = () => {
            if (gameOver) {
                renderGameOver();
                return;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);

            doodler.x += velocityX;
            if (doodler.x > boardWidth) {
                doodler.x = 0;
            } else if (doodler.x + doodler.width < 0) {
                doodler.x = boardWidth;
            }

            velocityY += gravity;
            doodler.y += velocityY;
            if (doodler.y > canvas.height) {
                setGameOver(true);
                renderGameOver();
                return;
            }
            context.drawImage(
                doodler.img,
                doodler.x,
                doodler.y,
                doodler.width,
                doodler.height
            );

            for (let i = 0; i < platformArray.length; i++) {
                let platform = platformArray[i];
                if (velocityY < 0 && doodler.y < (boardHeight * 3) / 4) {
                    platform.y -= velocityY;
                }
                if (detectCollision(doodler, platform) && velocityY >= 0 && !platform.steppedOn) {
                    velocityY = -5;
                    if (platform.isSpecial) {
                        platform.steppedOn = true;
                    }
                    updateScore(); // Update the score when the doodler lands on a platform
                }
                if (!platform.steppedOn) {
                    context.drawImage(
                        platform.img,
                        platform.x,
                        platform.y,
                        platform.width,
                        platform.height
                    );
                }
            }

            while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
                platformArray.shift();
                newPlatform();
            }

            // Draw the current score
            context.fillStyle = "black";
            context.font = "16px sans-serif";
            context.fillText(`Score: ${score}`, 5, 20);

            animationRef.current = requestAnimationFrame(update);
        };

        const moveDoodler = (e) => {
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                velocityX = 2;
                doodler.img = doodlerRightImg;
            } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
                velocityX = -2;
                doodler.img = doodlerLeftImg;
            } else if (e.code === "Space" && gameOver) {
                setGameOver(false);
                setScore(0);
                doodler = {
                    img: doodlerRightImg,
                    x: doodlerX,
                    y: doodlerY,
                    width: doodlerWidth,
                    height: doodlerHeight,
                };
                velocityX = 0;
                velocityY = -5;
                placePlatforms();
                requestAnimationFrame(update);
            }
        };

        placePlatforms();
        velocityY = -5; // Slowed down jump speed
        document.addEventListener("keydown", moveDoodler);
        animationRef.current = requestAnimationFrame(update);

        return () => {
            document.removeEventListener("keydown", moveDoodler);
            cancelAnimationFrame(animationRef.current);
        };
    }, [gameOver]);

    return <canvas id="board" ref={canvasRef} width="480" height="720"></canvas>;
};

export default DoodleJump;