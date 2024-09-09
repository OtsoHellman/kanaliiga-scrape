import { JSDOM } from 'jsdom';
import fs from 'fs';

const CHAMPION_ROLES = {
  Aatrox: [1],
  Ahri: [3],
  Akali: [1, 3],
  Akshan: [3],
  Alistar: [5],
  Amumu: [2],
  Anivia: [3],
  Annie: [3],
  Aphelios: [4],
  Ashe: [4],
  'Aurelion Sol': [3],
  Azir: [3],
  Bard: [5],
  "Bel'Veth": [2],
  Blitzcrank: [5],
  Brand: [5],
  Braum: [5],
  Briar: [2],
  Caitlyn: [4],
  Camille: [1],
  Cassiopeia: [3],
  "Cho'Gath": [1],
  Corki: [3],
  Darius: [1],
  Diana: [2, 3],
  'Dr. Mundo': [1],
  Draven: [4],
  Ekko: [2, 3],
  Elise: [2],
  Evelynn: [2],
  Ezreal: [4],
  Fiddlesticks: [2],
  Fiora: [1],
  Fizz: [3],
  Galio: [3],
  Gangplank: [1],
  Garen: [1],
  Gnar: [1],
  Gragas: [2],
  Graves: [2],
  Gwen: [1],
  Hecarim: [2],
  Heimerdinger: [3],
  Illaoi: [1],
  Irelia: [1, 3],
  Ivern: [2],
  Janna: [5],
  'Jarvan IV': [2],
  Jax: [1, 2],
  Jayce: [1],
  Jhin: [4],
  Jinx: [4],
  "K'Sante": [1],
  "Kai'Sa": [4],
  Kalista: [4],
  Karma: [5],
  Karthus: [2],
  Kassadin: [3],
  Katarina: [3],
  Kayle: [1],
  Kayn: [2],
  Kennen: [1],
  "Kha'Zix": [2],
  Kindred: [2],
  Kled: [1],
  "Kog'Maw": [4],
  LeBlanc: [3],
  'Lee Sin': [2],
  Leona: [5],
  Lillia: [2],
  Lissandra: [3],
  Lucian: [4],
  Lulu: [5],
  Lux: [3, 5],
  Malphite: [1, 5],
  Malzahar: [3],
  Maokai: [1],
  'Master Yi': [2],
  Milio: [5],
  'Miss Fortune': [4],
  Mordekaiser: [1],
  Morgana: [5],
  Naafiri: [3],
  Nami: [5],
  Nasus: [1],
  Nautilus: [5],
  Neeko: [3],
  Nidalee: [2],
  Nilah: [4],
  Nocturne: [2],
  'Nunu & Willump': [2, 3],
  Olaf: [2],
  Orianna: [3],
  Ornn: [1],
  Pantheon: [3, 5],
  Poppy: [1],
  Pyke: [5],
  Qiyana: [3],
  Quinn: [1],
  Rakan: [5],
  Rammus: [2],
  "Rek'Sai": [2],
  Rell: [5],
  'Renata Glasc': [5],
  Renekton: [1],
  Rengar: [2],
  Riven: [1],
  Rumble: [1],
  Ryze: [3],
  Samira: [4],
  Sejuani: [2],
  Senna: [5],
  Seraphine: [4, 5],
  Sett: [1, 2, 5],
  Shaco: [2],
  Shen: [1],
  Shyvana: [2],
  Singed: [1],
  Sion: [1],
  Sivir: [4],
  Skarner: [2],
  Sona: [5],
  Soraka: [5],
  Swain: [1, 3, 5],
  Sylas: [3],
  Syndra: [3],
  'Tahm Kench': [1],
  Taliyah: [2],
  Talon: [3],
  Taric: [5],
  Teemo: [1],
  Thresh: [5],
  Tristana: [4],
  Trundle: [2],
  Tryndamere: [1],
  'Twisted Fate': [3],
  Twitch: [4],
  Udyr: [2],
  Urgot: [1],
  Varus: [4],
  Vayne: [1, 4],
  Veigar: [3],
  "Vel'Koz": [3, 5],
  Vex: [3],
  Vi: [2],
  Viego: [2],
  Viktor: [3],
  Vladimir: [1, 3],
  Volibear: [1, 2],
  Warwick: [2],
  Wukong: [1],
  Xayah: [4],
  Xerath: [3, 5],
  'Xin Zhao': [2],
  Yasuo: [1, 3, 4],
  Yone: [1, 3],
  Yorick: [1],
  Yuumi: [5],
  Zac: [2],
  Zed: [3],
  Zeri: [4],
  Ziggs: [3],
  Zilean: [5],
  Zoe: [3],
  Zyra: [5],
};

const ROLE_MAP = {
  1: 'Top',
  2: 'Jungle',
  3: 'Mid',
  4: 'ADC',
  5: 'Support',
};

const ids = [
  '7077859396383350784',
  '7077857007579537408',
  '7077856947470557184',
  '7116583185885798400',
  '7116583151234170880',
  '7145386127211225088',
  '7145425473942855680',
  '7147862387220209664',
];

const sortPlayers = (players) => {
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

const scrapeTeamId = async (id: string) => {
  const url = `https://play.toornament.com/en_US/tournaments/7046801349616238592/participants/${id}/info`;

  const response = await fetch(url);
  const htmlText = await response.text();

  const {
    window: { DOMParser },
  } = new JSDOM();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  const title = doc.querySelector('.title > div > span').textContent;

  const playerElements = doc.querySelectorAll('.summoner_player_id');

  const players = await Promise.all(
    [...playerElements].map(async (element) => {
      const text: string = element.textContent;
      const match: string[] | null = text.match(/Summoner Name:\s+([\S\s]+)$/);
      if (!match?.length || !(match?.length > 1)) {
        return;
      }

      const name = match[1].trim();

      return await scrapeUggPlayer(name);
    })
  );

  const sortedPlayers = sortPlayers(players);
  console.log('--------------------\n');
  console.log(title);
  console.log(sortedPlayers.join('\n'));
};

const scrapeUggPlayer = async (name: string) => {
  const url = `https://u.gg/lol/profile/euw1/${encodeURIComponent(name)}/overview`;
  const response = await fetch(url);
  const htmlText = await response.text();

  const {
    window: { DOMParser },
  } = new JSDOM();

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  const rank =
    doc.querySelector('.rank-title')?.textContent ||
    [...doc.querySelectorAll('.historic-rank')].map((el) => el.textContent).join(', ');

  const favouriteRoles: { [key: string]: number } = {};

  const favouriteChampions = [...doc.querySelectorAll('.champion-stats')]
    .reduce((acc, el) => {
      const championName = el.querySelector('.champion-name').textContent;
      const championRoles = CHAMPION_ROLES[championName];
      const totalGames = parseInt(el.querySelector('.total-games').textContent.split(' ')[0]);

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

  return `${name}${getRoleString()}: ${rank}. ${favouriteChampions}`;
};
console.log('start');

ids.forEach(async (id) => await scrapeTeamId(id));
// https://u.gg/lol/profile/euw1/hugojiss/overview
// const hugo = await scrapeUggPlayer('hugojiss');

export {};

const getRoles = () => {
  fs.readFile('./roles.html', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const {
      window: { DOMParser },
    } = new JSDOM();

    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    const trs = doc.querySelectorAll('tr');
    const roles = [...trs].reduce((acc, tr) => {
      const tds = tr.querySelectorAll('td');
      if (!tds.length) {
        return acc;
      }
      const championName = tds[0].textContent.trim();
      const championRoles: number[] = [];
      for (let i = 1; i <= 6; i++) {
        const td = tds[i];
        const spans = td.querySelectorAll('span');
        if (spans.length) {
          championRoles.push(i);
        }
      }
      return {
        ...acc,
        [championName]: championRoles,
      };
    }, {});

    console.log(roles);
  });
};
