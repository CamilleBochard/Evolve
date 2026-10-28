import { describe, expect, it } from 'vitest';

import { skillsEarnedIn } from './rewards';

describe('skillsEarnedIn', () => {
  it('finds the hub and the satellites earned in a quest', () => {
    const skills = skillsEarnedIn('magento');
    const hub = skills.find((skill) => skill.name === 'Magento 2');
    expect(hub?.isHub).toBe(true);
    expect(skills.some((skill) => skill.name === 'Plugins')).toBe(true);
  });

  it('counts a skill also earned in another quest', () => {
    const names = skillsEarnedIn('magento').map((skill) => skill.name);
    expect(names).toContain('Design patterns');
  });

  it('gives nothing for a quest outside the tree', () => {
    expect(skillsEarnedIn('fondations')).toEqual([]);
  });
});
