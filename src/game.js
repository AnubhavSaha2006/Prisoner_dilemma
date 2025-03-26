// // src/game.ts
export class PrisonersDilemmaGame {
    constructor(mode, botStrategy) {
        this.rounds = 7;
        this.currentRound = 1;
        this.playerScore = 0;
        this.opponentScore = 0;
        this.lastPlayerMove = 'C';
        this.lastOpponentMove = 'C';
        this.mode = mode;
        if (mode === 'bot') {
            this.botStrategy = botStrategy || this.randomBotStrategy();
            console.log(`Bot strategy chosen: ${this.botStrategy}`); // Debugging log
        }
        else {
            this.botStrategy = 'always-cooperate';
        }
    }
    randomBotStrategy() {
        const strategies = [
            'random',
            'tit-for-tat',
            'grim-trigger',
            'pavlov',
            'forgiving-tit-for-tat',
            'always-cooperate',
            'always-betray'
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }
    getBotMove(playerLastMove) {
        switch (this.botStrategy) {
            case 'random':
                return Math.random() < 0.5 ? 'C' : 'B';
            case 'tit-for-tat':
                return playerLastMove;
            case 'grim-trigger':
                return playerLastMove === 'B' ? 'B' : 'C';
            case 'pavlov':
                return this.lastOpponentMove === 'C' ? 'C' : 'B';
            case 'forgiving-tit-for-tat':
                return playerLastMove === 'B' && Math.random() < 0.2 ? 'C' : playerLastMove;
            case 'always-cooperate':
                return 'C';
            case 'always-betray':
                return 'B';
            default:
                return 'C';
        }
    }
    calculateScore(playerMove, opponentMove) {
        if (playerMove === 'C' && opponentMove === 'C')
            return { player: 3, opponent: 3 };
        if (playerMove === 'C' && opponentMove === 'B')
            return { player: 0, opponent: 5 };
        if (playerMove === 'B' && opponentMove === 'C')
            return { player: 5, opponent: 0 };
        return { player: 1, opponent: 1 };
    }
    playRound(playerMove) {
        let opponentMove;
        if (this.mode === 'bot') {
            opponentMove = this.getBotMove(playerMove);
            console.log(`Bot move in round ${this.currentRound}: ${opponentMove} (Strategy: ${this.botStrategy})`);
            this.lastOpponentMove = opponentMove;
        }
        else {
            opponentMove = this.getBotMove(playerMove);
            this.lastOpponentMove = opponentMove;
        }
        this.lastPlayerMove = playerMove;
        const roundScore = this.calculateScore(playerMove, opponentMove);
        this.playerScore += roundScore.player;
        this.opponentScore += roundScore.opponent;
        this.currentRound++;
        return { playerMove, opponentMove, score: roundScore };
    }
    isGameOver() {
        return this.currentRound > this.rounds;
    }
    getWinner() {
        if (this.playerScore > this.opponentScore)
            return 'Player wins!';
        if (this.playerScore < this.opponentScore)
            return 'Opponent wins!';
        return "It's a tie!";
    }
    // Serialize to a JSON-friendly object.
    toJSON() {
        return {
            rounds: this.rounds,
            currentRound: this.currentRound,
            playerScore: this.playerScore,
            opponentScore: this.opponentScore,
            lastPlayerMove: this.lastPlayerMove,
            lastOpponentMove: this.lastOpponentMove,
            botStrategy: this.botStrategy,
            mode: this.mode,
        };
    }
    // Reconstruct a game instance from JSON.
    static fromJSON(json) {
        const game = new PrisonersDilemmaGame(json.mode, json.botStrategy);
        game.rounds = json.rounds;
        game.currentRound = json.currentRound;
        game.playerScore = json.playerScore;
        game.opponentScore = json.opponentScore;
        game.lastPlayerMove = json.lastPlayerMove;
        game.lastOpponentMove = json.lastOpponentMove;
        return game;
    }
}
// A simple in-memory leaderboard.
export const leaderboard = {};
//----------------------------------------------------------------------------
// export type Move = 'C' | 'B';
// export type BotStrategy = 
//   | 'random'
//   | 'tit-for-tat'
//   | 'grim-trigger'
//   | 'pavlov'
//   | 'forgiving-tit-for-tat'
//   | 'always-cooperate'
//   | 'always-betray';
// export interface GameJSON {
//   rounds: number;
//   currentRound: number;
//   playerScore: number;
//   opponentScore: number;
//   lastPlayerMove: Move;
//   lastOpponentMove: Move;
//   botStrategy: BotStrategy;
//   mode: 'bot' | 'player';
//   player1Move: Move | null;
//   player2Move: Move | null;
//   roundStartTime: number;
//   gameId?: string;
//   [key: string]: any;
// }
// export interface Score {
//   player: number;
//   opponent: number;
// }
// export class PrisonersDilemmaGame {
//   rounds: number = 7;
//   currentRound: number = 1;
//   playerScore: number = 0;
//   opponentScore: number = 0;
//   lastPlayerMove: Move = 'C';
//   lastOpponentMove: Move = 'C';
//   botStrategy: BotStrategy;
//   mode: 'bot' | 'player';
//   player1Move: Move | null = null;
//   player2Move: Move | null = null;
//   roundStartTime: number = Date.now();
//   gameId?: string;
//   constructor(mode: 'bot' | 'player', botStrategy?: BotStrategy, gameId?: string) {
//     this.mode = mode;
//     this.gameId = gameId;
//     if (mode === 'bot') {
//       this.botStrategy = botStrategy || this.randomBotStrategy();
//     } else {
//       this.botStrategy = 'always-cooperate';
//     }
//     this.roundStartTime = Date.now();
//   }
//   randomBotStrategy(): BotStrategy {
//     const strategies: BotStrategy[] = [
//       'random', 'tit-for-tat', 'grim-trigger', 'pavlov',
//       'forgiving-tit-for-tat', 'always-cooperate', 'always-betray'
//     ];
//     return strategies[Math.floor(Math.random() * strategies.length)];
//   }
//   getBotMove(playerLastMove: Move): Move {
//     const random = Math.random();
//     switch (this.botStrategy) {
//       case 'random':
//         return random < 0.5 ? 'C' : 'B';
//       case 'tit-for-tat':
//         return random < 0.1 ? (random < 0.5 ? 'C' : 'B') : playerLastMove;
//       case 'grim-trigger':
//         return playerLastMove === 'B' ? (random < 0.95 ? 'B' : 'C') : 'C';
//       case 'pavlov':
//         return this.lastOpponentMove === 'C' ? (random < 0.9 ? 'C' : 'B') : 'B';
//       case 'forgiving-tit-for-tat':
//         return playerLastMove === 'B' && random < 0.2 ? 'C' : 
//                (random < 0.1 ? (random < 0.5 ? 'C' : 'B') : playerLastMove);
//       case 'always-cooperate':
//         return 'C';
//       case 'always-betray':
//         return 'B';
//       default:
//         return 'C';
//     }
//   }
//   calculateScore(playerMove: Move, opponentMove: Move): Score {
//     if (playerMove === 'C' && opponentMove === 'C') return { player: 3, opponent: 3 };
//     if (playerMove === 'C' && opponentMove === 'B') return { player: 0, opponent: 5 };
//     if (playerMove === 'B' && opponentMove === 'C') return { player: 5, opponent: 0 };
//     return { player: 1, opponent: 1 };
//   }
//   submitMove(player: 'player1' | 'player2', move: Move): void {
//     if (player === 'player1') this.player1Move = move;
//     else this.player2Move = move;
//   }
//   processRound(): boolean {
//     if (this.mode === 'player') {
//       if (this.player1Move && this.player2Move) {
//         const score = this.calculateScore(this.player1Move, this.player2Move);
//         this.playerScore += score.player;
//         this.opponentScore += score.opponent;
//         this.lastPlayerMove = this.player1Move;
//         this.lastOpponentMove = this.player2Move;
//         this.currentRound++;
//         this.player1Move = null;
//         this.player2Move = null;
//         this.roundStartTime = Date.now();
//         return true;
//       }
//       return false;
//     }
//     return false;
//   }
//   isGameOver(): boolean {
//     return this.currentRound > this.rounds;
//   }
//   getWinner(): string {
//     if (this.playerScore > this.opponentScore) return 'Player 1 wins!';
//     if (this.playerScore < this.opponentScore) return 'Player 2 wins!';
//     return "It's a tie!";
//   }
//   toJSON(): GameJSON {
//     return {
//       rounds: this.rounds,
//       currentRound: this.currentRound,
//       playerScore: this.playerScore,
//       opponentScore: this.opponentScore,
//       lastPlayerMove: this.lastPlayerMove,
//       lastOpponentMove: this.lastOpponentMove,
//       botStrategy: this.botStrategy,
//       mode: this.mode,
//       player1Move: this.player1Move,
//       player2Move: this.player2Move,
//       roundStartTime: this.roundStartTime,
//       gameId: this.gameId,
//     };
//   }
//   static fromJSON(json: GameJSON): PrisonersDilemmaGame {
//     const game = new PrisonersDilemmaGame(json.mode, json.botStrategy, json.gameId);
//     game.rounds = json.rounds;
//     game.currentRound = json.currentRound;
//     game.playerScore = json.playerScore;
//     game.opponentScore = json.opponentScore;
//     game.lastPlayerMove = json.lastPlayerMove;
//     game.lastOpponentMove = json.lastOpponentMove;
//     game.player1Move = json.player1Move;
//     game.player2Move = json.player2Move;
//     game.roundStartTime = json.roundStartTime;
//     return game;
//   }
// }
// export const leaderboard: Record<string, number> = {};
