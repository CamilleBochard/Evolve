// Character sheet of the paladev: class, level, attributes and equipment.

export const CHARACTER = {
  name: 'Paladev',
  classLabel: 'Paladin // développeur',
  level: 3,
  // Progress towards the next level, from 0 to 1.
  experience: 0.6,
};

export interface Attribute {
  abbreviation: string;
  name: string;
}

// One attribute per branch of the skill tree, in the same order.
export const ATTRIBUTES: Attribute[] = [
  { abbreviation: 'FOR', name: 'Force' },
  { abbreviation: 'DEX', name: 'Dextérité' },
  { abbreviation: 'CON', name: 'Constitution' },
  { abbreviation: 'SAG', name: 'Sagesse' },
];

// Line art drawn in each equipment module.
export type ModuleArt = 'sword' | 'shield' | 'visor' | 'core';

export interface EquipmentModule {
  number: string;
  slot: string;
  tool: string;
  art: ModuleArt;
}

export const EQUIPMENT: EquipmentModule[] = [
  { number: '01', slot: 'Épée', tool: 'PhpStorm', art: 'sword' },
  { number: '02', slot: 'Bouclier', tool: 'Pest · PHPUnit', art: 'shield' },
  { number: '03', slot: 'Visière', tool: 'Git', art: 'visor' },
  { number: '04', slot: 'Inspiration', tool: 'Claude Code', art: 'core' },
];
