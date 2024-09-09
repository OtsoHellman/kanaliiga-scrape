import { TOORNAMENT_IDS } from './consts';
import { scrapeTeamId } from './scraper';

const main = () => {
  console.log('start');
  const pres = new pptxgen();

  TOORNAMENT_IDS.forEach((id) => scrapeTeamId(id));
  // https://u.gg/lol/profile/euw1/hugojiss/overview
  // const hugo = await scrapeUggPlayer('hugojiss');
};

main();
