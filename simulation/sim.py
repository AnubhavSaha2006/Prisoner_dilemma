
import random

R, T, S, P = 3, 5, 0, 1

def always_cooperate(history_self, history_opp):
    return 'C'

def always_betray(history_self, history_opp):
    return 'B'

def tit_for_tat(history_self, history_opp):
    return 'C' if not history_opp else history_opp[-1]

def forgiving_tit_for_tat(history_self, history_opp):
    if not history_opp:
        return 'C'
    if history_opp[-1] == 'B' and random.random() < 0.3:
        return 'C'
    return history_opp[-1]

def grim_trigger(history_self, history_opp):
    return 'B' if 'B' in history_opp else 'C'

def pavlov(history_self, history_opp):
    if not history_self:
        return 'C'
    if history_opp[-1] == 'C':
        return history_self[-1]
    else:
        return 'B' if history_self[-1] == 'C' else 'C'

def random_strategy(history_self, history_opp):
    return random.choice(['C', 'B'])

strategies = {
    'Always Cooperate': always_cooperate,
    'Always Betray': always_betray,
    'Tit-for-Tat': tit_for_tat,
    'Forgiving Tit-for-Tat': forgiving_tit_for_tat,
    'Grim Trigger': grim_trigger,
    'Pavlov': pavlov,
    'Random': random_strategy
}

def payoff(a, b):
    if a == 'C' and b == 'C':
        return R, R
    elif a == 'C' and b == 'B':
        return S, T
    elif a == 'B' and b == 'C':
        return T, S
    else:
        return P, P

def simulate(strategy1, strategy2, rounds=100):
    history1, history2 = [], []
    total1, total2 = 0, 0
    for _ in range(rounds):
        move1 = strategies[strategy1](history1, history2)
        move2 = strategies[strategy2](history2, history1)
        p1, p2 = payoff(move1, move2)
        total1 += p1
        total2 += p2
        history1.append(move1)
        history2.append(move2)
    return total1, total2

def run_simulation():
    strategy_list = list(strategies.keys())
    results = []
    for s1 in strategy_list:
        row = []
        for s2 in strategy_list:
            score1, score2 = simulate(s1, s2)
            row.append(score1)
        results.append(row)
    return strategy_list, results

if __name__ == "__main__":
    strategy_list, results = run_simulation()
    print("Results Matrix:")
    print("                " + " | ".join(f"{s[:13]:<13}" for s in strategy_list))
    print("-" * (17 * len(strategy_list)))
    for s, row in zip(strategy_list, results):
        print(f"{s:<16} " + " | ".join(f"{val:<13}" for val in row))
