import PptxGenJS from 'pptxgenjs';
import { createMasterSlides } from './asd';
import pptxgen from 'pptxgenjs';
import { genContentSlide, genThanksSlide, genTitleSlide } from './demo_master.js';
import { TOORNAMENT_IDS } from './consts';
import { scrapeTeamId } from './scraper';

const main = async () => {
  console.log('start');
  // STEP 1: Instantiate new PptxGenJS object
  let pptx: PptxGenJS = typeof PptxGenJS !== 'undefined' ? new PptxGenJS() : new pptxgen();

  // STEP 2: Set Presentation props (as QA test only - these are not required)
  pptx.title = 'Kanaliiga lol Season 5';
  pptx.author = 'Captain Sehteri';
  pptx.company = 'Negevlight Consulting oy';
  pptx.revision = '15';
  pptx.layout = 'LAYOUT_WIDE';

  // STEP 4: Create Master Slides (from the old `pptxgen.masters.js` file - `gObjPptxMasters` items)
  createMasterSlides(pptx);

  pptx.addSection({ title: 'Masters' });

  genTitleSlide(pptx);

  await Promise.all(
    TOORNAMENT_IDS.map(async (id) => {
      const { teamName, players } = await scrapeTeamId(id);

      console.log('--------------------\n');
      console.log(teamName);
      console.log(players.map((player) => player?.infoString).join('\n'));
      genContentSlide(pptx, teamName, players);
    })
  );

  genThanksSlide(pptx);

  // https://u.gg/lol/profile/euw1/hugojiss/overview
  // const hugo = await scrapeUggPlayer('hugojiss');

  return pptx.writeFile({
    fileName: 'Kanaliiga lol Season 5',
  });
};

main();
