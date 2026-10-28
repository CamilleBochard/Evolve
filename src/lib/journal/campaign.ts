// Progress of the whole campaign, shown under the prologue.
import { CAMPAIGN_YEARS, QUESTS, QUEST_CHAPTERS } from '../../data/quests';

export interface CampaignStats {
  doneCount: number;
  questCount: number;
  openChapterCount: number;
  chapterCount: number;
  years: number;
}

export function campaignStats(): CampaignStats {
  const doneQuests = QUESTS.filter((quest) => quest.status === 'done');
  const openChapters = QUEST_CHAPTERS.filter((chapter) => !chapter.isLocked);
  const stats: CampaignStats = {
    doneCount: doneQuests.length,
    questCount: QUESTS.length,
    openChapterCount: openChapters.length,
    chapterCount: QUEST_CHAPTERS.length,
    years: CAMPAIGN_YEARS,
  };
  return stats;
}
