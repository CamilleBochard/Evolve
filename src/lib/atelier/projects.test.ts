import { describe, expect, it } from 'vitest';

import { PROJECTS } from '../../data/projects';
import {
  findProject,
  isProjectId,
  notebookStats,
  projectSkills,
} from './projects';

describe('isProjectId', () => {
  it('recognises the ids of the address', () => {
    expect(isProjectId('scene-3d')).toBe(true);
    expect(isProjectId('potager')).toBe(false);
  });
});

describe('notebookStats', () => {
  it('counts the hypotheses of every project by verdict', () => {
    expect(notebookStats(PROJECTS)).toEqual({
      experimentCount: 5,
      confirmedCount: 1,
      refutedCount: 4,
    });
  });
});

describe('projectSkills', () => {
  it('takes the skills of the journal quest of the project', () => {
    const names = projectSkills(findProject('chessme')).map(
      (skill) => skill.name,
    );
    expect(names).toContain('Python');
  });

  it('gives nothing for a project without quest', () => {
    expect(projectSkills(findProject('chatbot'))).toEqual([]);
  });
});
