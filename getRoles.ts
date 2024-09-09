import { JSDOM } from 'jsdom';
import fs from 'fs';

export const getRoles = () => {
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
