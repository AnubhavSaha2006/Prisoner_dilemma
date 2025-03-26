// src/main.tsx
import { Devvit, useState } from '@devvit/public-api';
import { PrisonersDilemmaGame, leaderboard } from './game.js'; // Use .js extension
Devvit.configure({
    redditAPI: true,
});
// Our initial game state is null.
const initialGameState = null;
Devvit.addCustomPostType({
    name: "PrisonersDilemmaGame",
    description: "Play a 7-round Prisoner's Dilemma game.",
    render: () => {
        // Use React state for our game state, mode, round result, game over flag, and leaderboard.
        const [gameState, setGameState] = useState(initialGameState);
        const [gameMode, setGameMode] = useState("none");
        const [roundResult, setRoundResult] = useState("");
        const [gameOver, setGameOver] = useState(false);
        const [leaderboardState, setLeaderboardState] = useState({ ...leaderboard });
        // Function to start a new game.
        const startGame = (mode) => {
            setGameMode(mode);
            let newGame;
            if (mode === "bot") {
                newGame = new PrisonersDilemmaGame("bot");
            }
            else {
                newGame = new PrisonersDilemmaGame("player");
            }
            setGameState(newGame.toJSON());
            setGameOver(false);
            setRoundResult("");
        };
        // Function to handle player's move.
        const handleMove = (move) => {
            if (!gameState)
                return;
            // Reconstruct the game instance from the stored JSON state.
            let gameInstance = PrisonersDilemmaGame.fromJSON(gameState);
            const result = gameInstance.playRound(move);
            const resText = `You chose ${result.playerMove === "C" ? "Cooperate" : "Betray"} | ` +
                `Opponent chose ${result.opponentMove === "C" ? "Cooperate" : "Betray"}\n` +
                `This round: You +${result.score.player}, Opponent +${result.score.opponent}`;
            setRoundResult(resText);
            if (gameInstance.isGameOver()) {
                setGameOver(true);
                const winner = gameInstance.getWinner();
                // Update leaderboard for demonstration purposes.
                leaderboard["player1"] = (leaderboard["player1"] || 0) + gameInstance.playerScore;
                setLeaderboardState({ ...leaderboard });
                setRoundResult(resText +
                    `\nGame Over: ${winner}\nFinal Score: You ${gameInstance.playerScore} - Opponent ${gameInstance.opponentScore}`);
            }
            // Update the state with the new game instance.
            setGameState(gameInstance.toJSON());
        };
        return (Devvit.createElement("blocks", { height: "regular" },
            Devvit.createElement("vstack", { gap: "medium", alignment: "center middle", padding: "medium" },
                gameMode === "none" && (Devvit.createElement(Devvit.Fragment, null,
                    Devvit.createElement("text", { size: "large" }, "Prisoner's Dilemma Game"),
                    Devvit.createElement("button", { onPress: () => startGame("player") }, "Play vs Player"),
                    Devvit.createElement("button", { onPress: () => startGame("bot") }, "Play vs Bot"))),
                gameMode !== "none" && !gameOver && gameState && (Devvit.createElement(Devvit.Fragment, null,
                    Devvit.createElement("text", { size: "medium" },
                        "Round ",
                        gameState.currentRound,
                        " of ",
                        gameState.rounds),
                    Devvit.createElement("hstack", { gap: "small" },
                        Devvit.createElement("button", { onPress: () => handleMove("C") }, "Cooperate"),
                        Devvit.createElement("button", { onPress: () => handleMove("B") }, "Betray")),
                    roundResult && Devvit.createElement("text", null, roundResult))),
                gameOver && gameState && (Devvit.createElement(Devvit.Fragment, null,
                    Devvit.createElement("text", { size: "large" }, "Game Over!"),
                    Devvit.createElement("text", { size: "medium" },
                        "Final Score: You ",
                        gameState.playerScore,
                        " - Opponent ",
                        gameState.opponentScore),
                    Devvit.createElement("text", { size: "medium" }, PrisonersDilemmaGame.fromJSON(gameState).getWinner()),
                    Devvit.createElement("button", { onPress: () => {
                            // Reset state for a new game.
                            setGameMode("none");
                            setGameState(null);
                            setGameOver(false);
                            setRoundResult("");
                        } }, "Play Again"))),
                Devvit.createElement("vstack", { gap: "small" },
                    Devvit.createElement("text", { size: "medium" }, "Leaderboard"),
                    Object.entries(leaderboardState).map(([player, score]) => (Devvit.createElement("text", { key: player },
                        player,
                        ": ",
                        score)))))));
    },
});
Devvit.addMenuItem({
    label: "Add Prisoner's Dilemma Game",
    location: "subreddit",
    onPress: async (_event, context) => {
        const currentSubreddit = await context.reddit.getCurrentSubreddit();
        const post = await context.reddit.submitPost({
            title: "Prisoner's Dilemma Game",
            subredditName: currentSubreddit.name,
            preview: (Devvit.createElement("vstack", null,
                Devvit.createElement("text", null, "Loading interactive post..."))),
        });
        // Use the UI methods provided in the context (cast as any to avoid type errors).
        context.ui.showToast(`Submitted interactive post to r/${currentSubreddit.name}`);
        context.ui.navigateTo(post);
    },
});
export default Devvit;
//-----------------------------------------------------
// import { Devvit, useState, useInterval } from '@devvit/public-api';
// import { PrisonersDilemmaGame, Move, leaderboard, type GameJSON } from './game.js';
// Devvit.configure({
//   redditAPI: true,
//   kvStore: true,
// });
// Devvit.addCustomPostType({
//   name: "PrisonersDilemmaGame",
//   description: "Play a 7-round Prisoner's Dilemma game.",
//   render: ({ context }) => {
//     // Properly typed state hooks
//     const [gameState, setGameState] = useState<GameJSON | null>(null);
//     const [gameMode, setGameMode] = useState<'none' | 'bot' | 'player'>('none');
//     const [roundResult, setRoundResult] = useState<string>('');
//     const [gameOver, setGameOver] = useState<boolean>(false);
//     const [leaderboardState, setLeaderboardState] = useState<Record<string, number>>({});
//     const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2' | null>(null);
//     const [gameId, setGameId] = useState<string>('');
//     const [timeLeft, setTimeLeft] = useState<number>(4);
//     const updateLeaderboard = async (username: string, score: number): Promise<void> => {
//       leaderboard[username] = (leaderboard[username] || 0) + score;
//       await context.kvStore.put('leaderboard', leaderboard);
//       setLeaderboardState({ ...leaderboard });
//     };
//     const loadLeaderboard = async (): Promise<void> => {
//       const lb = await context.kvStore.get<Record<string, number>>('leaderboard');
//       setLeaderboardState(lb || {});
//     };
//     const startGame = async (mode: 'bot' | 'player'): Promise<void> => {
//       setGameMode(mode);
//       setGameOver(false);
//       setRoundResult('');
//       if (mode === 'player') {
//         const matchmaking = await context.kvStore.get<string[]>('matchmaking') || [];
//         if (matchmaking.length > 0) {
//           const [existingGameId, ...remaining] = matchmaking;
//           await context.kvStore.set('matchmaking', remaining);
//           const game = new PrisonersDilemmaGame('player', undefined, existingGameId);
//           await context.kvStore.set(existingGameId, game.toJSON());
//           setCurrentPlayer('player2');
//           setGameId(existingGameId);
//           setGameState(game.toJSON());
//         } else {
//           const newGameId = `game-${Date.now()}`;
//           const game = new PrisonersDilemmaGame('player', undefined, newGameId);
//           await context.kvStore.set('matchmaking', [newGameId, ...matchmaking]);
//           await context.kvStore.set(newGameId, game.toJSON());
//           setCurrentPlayer('player1');
//           setGameId(newGameId);
//           setGameState(game.toJSON());
//         }
//       } else {
//         const game = new PrisonersDilemmaGame('bot');
//         setGameState(game.toJSON());
//       }
//       loadLeaderboard();
//     };
//     const handleMove = async (move: Move): Promise<void> => {
//       if (!gameId || !currentPlayer || !gameState) return;
//       try {
//         const gameData = await context.kvStore.get<GameJSON>(gameId);
//         if (!gameData) return;
//         const game = PrisonersDilemmaGame.fromJSON(gameData);
//         game.submitMove(currentPlayer, move);
//         if (game.mode === 'player') {
//           if (game.processRound()) {
//             if (game.isGameOver()) {
//               const user = await context.reddit.getCurrentUser();
//               await updateLeaderboard(user.username, game.playerScore);
//               setGameOver(true);
//             }
//             await context.kvStore.set(gameId, game.toJSON());
//             setGameState(game.toJSON());
//           }
//         } else {
//           const opponentMove = game.getBotMove(move);
//           const score = game.calculateScore(move, opponentMove);
//           game.playerScore += score.player;
//           game.opponentScore += score.opponent;
//           game.currentRound++;
//           if (game.isGameOver()) {
//             const user = await context.reddit.getCurrentUser();
//             await updateLeaderboard(user.username, game.playerScore);
//             setGameOver(true);
//           }
//           setGameState(game.toJSON());
//         }
//       } catch (error) {
//         console.error('Error handling move:', error);
//       }
//     };
//     useInterval(async () => {
//       if (gameMode !== 'player' || !gameId || !currentPlayer) return;
//       try {
//         const gameData = await context.kvStore.get<GameJSON>(gameId);
//         if (!gameData) return;
//         const now = Date.now();
//         setTimeLeft(Math.max(0, 4 - Math.floor((now - gameData.roundStartTime) / 1000)));
//         if (now - gameData.roundStartTime > 4000) {
//           const game = PrisonersDilemmaGame.fromJSON(gameData);
//           if (!game.player1Move) game.submitMove('player1', Math.random() < 0.5 ? 'C' : 'B');
//           if (!game.player2Move) game.submitMove('player2', Math.random() < 0.5 ? 'C' : 'B');
//           if (game.processRound()) {
//             if (game.isGameOver()) {
//               const user = await context.reddit.getCurrentUser();
//               await updateLeaderboard(user.username, game.playerScore);
//               setGameOver(true);
//             }
//             await context.kvStore.set(gameId, game.toJSON());
//             setGameState(game.toJSON());
//           }
//         }
//       } catch (error) {
//         console.error('Interval error:', error);
//       }
//     }, 1000);
//     return (
//       <blocks height="regular">
//         <vstack gap="medium" alignment="center middle" padding="medium">
//           {gameMode === "none" && (
//             <>
//               <text size="large">Prisoner's Dilemma Game</text>
//               <button onPress={() => startGame("player")}>Play vs Player</button>
//               <button onPress={() => startGame("bot")}>Play vs Bot</button>
//             </>
//           )}
//           {gameMode !== "none" && !gameOver && gameState && (
//             <>
//               <text size="medium">
//                 Round {gameState.currentRound} of {gameState.rounds}
//               </text>
//               {gameMode === 'player' && currentPlayer && (
//                 <text>Playing as {currentPlayer}</text>
//               )}
//               <text>Time left: {timeLeft}s</text>
//               <hstack gap="small">
//                 <button onPress={() => handleMove("C")}>Cooperate</button>
//                 <button onPress={() => handleMove("B")}>Betray</button>
//               </hstack>
//               {roundResult && <text>{roundResult}</text>}
//             </>
//           )}
//           {gameOver && gameState && (
//             <>
//               <text size="large">Game Over!</text>
//               <text size="medium">
//                 Final Score: {gameState.playerScore} - {gameState.opponentScore}
//               </text>
//               <text size="medium">
//                 {PrisonersDilemmaGame.fromJSON(gameState).getWinner()}
//               </text>
//               <button onPress={() => {
//                 setGameMode("none");
//                 setGameState(null);
//                 setGameOver(false);
//                 setRoundResult("");
//                 setCurrentPlayer(undefined);
//                 setGameId('');
//               }}>
//                 Play Again
//               </button>
//             </>
//           )}
//           <vstack gap="small">
//             <text size="medium">Leaderboard</text>
//             {Object.entries(leaderboardState).map(([player, score]) => (
//               <text key={player}>
//                 {player}: {score}
//               </text>
//             ))}
//           </vstack>
//         </vstack>
//       </blocks>
//     );
//   },
// });
// Devvit.addMenuItem({
//   label: "Add Prisoner's Dilemma Game",
//   location: "subreddit",
//   onPress: async (event, context) => {
//     try {
//       const currentSubreddit = await context.reddit.getCurrentSubreddit();
//       const post = await context.reddit.submitPost({
//         title: "Prisoner's Dilemma Game",
//         subredditName: currentSubreddit.name,
//         preview: <vstack><text>Loading game...</text></vstack>,
//       });
//       context.ui.showToast(`Game created in r/${currentSubreddit.name}!`);
//       context.ui.navigateTo(post);
//     } catch (error) {
//       console.error('Error creating game:', error);
//     }
//   },
// });
// export default Devvit;
