export const sortPlayers = (players) => {
  const ranks = [
    'Iron',
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Emerald',
    'Diamond',
    'Master',
    'Grandmaster',
    'Challenger',
  ];

  return [...players].sort((a, b) => {
    const rankIndexA = ranks.findIndex((rank) => a.includes(rank));
    const rankIndexB = ranks.findIndex((rank) => b.includes(rank));
    return rankIndexB - rankIndexA;
  });
};
