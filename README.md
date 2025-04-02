# Prisoner's Dilemma Game

A web-based interactive implementation of the classic Prisoner's Dilemma game. This project allows players to engage in a 7-round game either against a bot with various strategies or against another player. The game is built using TypeScript and a React-like UI framework for interactive Reddit posts through Devvit.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Game Mechanics](#game-mechanics)
- [Bot Strategies](#bot-strategies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Prisoner's Dilemma Game simulates a classic dilemma where two participants must decide whether to cooperate or betray. Each round awards points based on both players' decisions. The interactive post can be played directly on Reddit using Devvit's platform.

## Features

- **Interactive Gameplay:** Play a 7-round game with dynamic scoring.
- **Multiple Modes:** Choose between playing against a bot or another player.
- **Diverse Bot Strategies:** Includes strategies such as random, tit-for-tat, grim-trigger, pavlov, forgiving tit-for-tat, always cooperate, and always betray.
- **Leaderboard:** Tracks and displays scores for demonstration purposes.
- **Serialization:** Game state can be saved and restored using JSON.
- **Devvit Integration:** Easily submit the game as an interactive post on Reddit.

## Game Mechanics

- **Rounds:** The game is played over 7 rounds.
- **Scoring System:**
  - Both cooperate: +3 points each.
  - You cooperate, opponent betrays: You get 0, opponent gets +5.
  - You betray, opponent cooperates: You get +5, opponent gets 0.
  - Both betray: +1 point each.
- **Game Over:** The game ends after 7 rounds and declares a winner based on total scores.

## Bot Strategies

The bot can use one of the following strategies:

- **Random:** Chooses randomly between cooperating (C) and betraying (B).
- **Tit-for-Tat:** Mimics the player's last move.
- **Grim Trigger:** Cooperates until the player betrays, then always betrays.
- **Pavlov:** Repeats its previous move if the opponent cooperated; otherwise, betrays.
- **Forgiving Tit-for-Tat:** Similar to tit-for-tat but occasionally forgives a betrayal.
- **Always Cooperate:** Always cooperates.
- **Always Betray:** Always betrays.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/prisoners-dilemma-game.git
   cd prisoners-dilemma-game
