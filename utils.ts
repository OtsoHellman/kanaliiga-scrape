export interface Player {
  infoString: string;
  favouriteChampions: string[];
}

export const sortPlayers = (players: (Player | undefined)[]): (Player | undefined)[] => {
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
    const rankIndexA = ranks.findIndex((rank) => a?.infoString.includes(rank));
    const rankIndexB = ranks.findIndex((rank) => b?.infoString.includes(rank));
    return rankIndexB - rankIndexA;
  });
};
