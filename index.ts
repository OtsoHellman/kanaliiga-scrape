import PptxGenJS from 'pptxgenjs';
import pptxgen from 'pptxgenjs';
import { genContentSlide, genThanksSlide, genTitleSlide } from './pptx/demo_master.js';
import { TOORNAMENT_TEAM_IDS } from './src/consts.js';
import { scrapeTeamId } from './src/scraper.js';
import { createMasterSlides } from './pptx/createTemplate.js';

const main = async () => {
  console.log('start');

  if (!TOORNAMENT_TEAM_IDS.length) {
    throw new Error('Update Toornament team ids in consts :]');
  }

  // STEP 1: Instantiate new PptxGenJS object
  let pptx: PptxGenJS = typeof PptxGenJS !== 'undefined' ? new PptxGenJS() : new pptxgen();

  // STEP 2: Set Presentation props (as QA test only - these are not required)
  pptx.title = 'Kanaliiga lol Season 6';
  pptx.author = 'Captain Sehteri';
  pptx.company = 'Negevlight Consulting oy';
  pptx.revision = '15';
  pptx.layout = 'LAYOUT_WIDE';

  // STEP 4: Create Master Slides (from the old `pptxgen.masters.js` file - `gObjPptxMasters` items)
  createMasterSlides(pptx);

  pptx.addSection({ title: 'Masters' });

  genTitleSlide(pptx);

  await Promise.all(
    TOORNAMENT_TEAM_IDS.map(async (id) => {
      const { teamName, players } = await scrapeTeamId(id);

      console.log('--------------------\n');
      console.log(teamName);
      console.log(players.map((player) => player?.infoString).join('\n'));
      if (!teamName) return;
      genContentSlide(pptx, teamName, players);
    })
  );

  genThanksSlide(pptx);

  return pptx.writeFile({
    fileName: 'Kanaliiga lol Season 6',
  });
};

main();
