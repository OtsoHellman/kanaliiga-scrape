import { JSDOM } from 'jsdom';
import { CHAMPION_ROLES, ROLE_MAP, TOORNAMENT_ID } from './consts';
import { Player, sortPlayers } from './utils';

export const scrapeTeamId = async (id: string) => {
  const url = `https://play.toornament.com/en_US/tournaments/${TOORNAMENT_ID}/participants/${id}/info`;

  const response = await fetch(url);
  const htmlText = await response.text();

  const {
    window: { DOMParser },
  } = new JSDOM();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  const title = doc.querySelector('.title > div > span')?.textContent;

  const playerElements = doc.querySelectorAll('.summoner_player_id');

  const players = await Promise.all(
    [...playerElements].map(async (element) => {
      const text = element.textContent;
      const match = text?.match(/Summoner Name:\s+([\S\s]+)$/);
      if (!match?.length || !(match?.length > 1)) {
        return;
      }

      const name = match[1].trim();

      return await scrapeUggPlayer(name);
    })
  );

  const sortedPlayers = sortPlayers(players);

  return { teamName: title, players: sortedPlayers };
};

export const scrapeUggPlayer = async (name: string): Promise<Player> => {
  const HARDCODED_SUFFIX = '-EUW'; // TODO implement this properly somehow
  const url = `https://u.gg/lol/profile/euw1/${encodeURIComponent(name)}${HARDCODED_SUFFIX}/overview`;
  const response = await fetch(url);
  const htmlText = await response.text();

  const {
    window: { DOMParser },
  } = new JSDOM();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  const rank =
    doc.querySelector('.rank-title')?.textContent ||
    [...doc.querySelectorAll('.historic-rank')]
      .map((el) => el.textContent)
      .slice(0, 3)
      .join(', ');

  const favouriteRoles: { [key: string]: number } = {};

  const favouriteChampions: string[] = [];
  const favouriteChampionsString = [...doc.querySelectorAll('.champion-stats')]
    .reduce<string[]>((acc, el) => {
      const championName = el.querySelector('.champion-name')?.textContent;
      if (!championName) return acc;
      favouriteChampions.push(championName);
      const championRoles = CHAMPION_ROLES[championName];
      const totalGamesContent = el.querySelector('.total-games')?.textContent;
      if (!totalGamesContent) return acc;
      const totalGames = parseInt(totalGamesContent.split(' ')[0]);

      championRoles.forEach((role) => {
        favouriteRoles[role] = favouriteRoles[role] ? favouriteRoles[role] + totalGames : totalGames;
      });

      return [...acc, `${championName} (${totalGames})`];
    }, [])
    .slice(0, 3)
    .join(', ');

  const getRoleString = () => {
    if (!Object.keys(favouriteRoles).length) {
      return '';
    }
    const totalGames = Object.values(favouriteRoles).reduce((acc, val) => acc + val, 0);

    const role = Object.keys(favouriteRoles).reduce((acc, key) => {
      if (favouriteRoles[key] > favouriteRoles[acc]) {
        return key;
      }
      return acc;
    });

    const roleValue = ROLE_MAP[role];
    const roleGamesPercentage = ((favouriteRoles[role] / totalGames) * 100).toFixed(2);
    return ` (${roleValue} ${roleGamesPercentage}%)`;
  };

  return {
    infoString: `${name}${getRoleString()}: ${rank}. ${favouriteChampionsString}`,
    favouriteChampions,
    uggUrl: url,
  };
};
