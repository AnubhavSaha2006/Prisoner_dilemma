
# Iterated Prisoner's Dilemma Strategy Simulation

This project simulates 7 classic strategies in the Iterated Prisoner's Dilemma and analyzes their performance against each other.

## Strategies Included

- Always Cooperate
- Always Betray
- Tit-for-Tat
- Forgiving Tit-for-Tat
- Grim Trigger
- Pavlov (Win-Stay, Lose-Shift)
- Random

## Simulation Setup

- Rounds: 100 per matchup
- Payoff matrix:
  - Reward (C, C): 3
  - Temptation (B, C): 5
  - Sucker (C, B): 0
  - Punishment (B, B): 1

## Results Matrix (Total Score over 100 rounds)

|                       | Always Cooperate | Always Betray | Tit-for-Tat | Forgiving Tit-for-Tat | Grim Trigger | Pavlov | Random |
|-----------------------|------------------|---------------|-------------|------------------------|---------------|--------|--------|
| Always Cooperate      | 300              | 0             | 300         | 300                    | 300           | 300    | 183    |
| Always Betray         | 500              | 100           | 104         | 68                     | 104           | 300    | 272    |
| Tit-for-Tat           | 300              | 99            | 300         | 300                    | 300           | 300    | 213    |
| Forgiving TFT         | 300              | 68            | 300         | 300                    | 300           | 300    | 167    |
| Grim Trigger          | 300              | 99            | 300         | 300                    | 300           | 300    | 291    |
| Pavlov                | 300              | 50            | 300         | 300                    | 300           | 300    | 231    |
| Random                | 400              | 47            | 235         | 247                    | 63            | 206    | 207    |

## Observations
- Pavlov (Win-Stay, Lose-Shift)
    Pavlov consistently achieves high scores across most matchups. It rewards mutual cooperation but quickly switches strategies after being exploited, allowing it to adapt against defectors. Its ability to return to cooperation when conditions improve makes it robust against both exploiters and forgiving opponents.

- Tit-for-Tat (TFT)
    TFT performs well when facing cooperative or semi-cooperative strategies. It promotes mutual cooperation but immediately retaliates after betrayal. While effective against straightforward opponents, it can enter cycles of retaliation when noise or randomness is introduced, as seen in suboptimal performance against Random.

- Forgiving Tit-for-Tat
    A modification of TFT, this strategy occasionally forgives betrayals. It avoids long chains of mutual retaliation and performs better than TFT against noisy or mixed opponents like Random and Pavlov. It maintains strong cooperation with other cooperative strategies and adapts better in uncertain environments.

- Grim Trigger
    Grim Trigger is highly cooperative until the first betrayal—after which it switches to permanent defection. This makes it strong against cooperative players but extremely fragile against any mistake or randomness. Its inability to recover from one-time defections results in poor performance against strategies like Random and Pavlov.

- Always Cooperate
    This strategy is the most exploitable. While it scores decently against other cooperative strategies, it performs abysmally against defectors or adaptive strategies. It serves more as a benchmark for cooperative behavior than a viable competitive approach.

- Always Betray
    Gains the maximum payoff when paired with Always Cooperate but fails to build sustainable cooperation with any adaptive or retaliating strategy. Its long-term scores are generally low, indicating that pure exploitation is not an effective approach in repeated interactions.

- Random
    The Random strategy’s unpredictability leads to unstable interactions. Against cooperative strategies, it sometimes gains short-term advantage, but lacks any mechanism to build mutual trust or avoid retaliation. Its performance varies significantly depending on luck and the opponent's level of forgiveness.

## How to Run

Save sim.py and run:

```bash
python sim.py
```
