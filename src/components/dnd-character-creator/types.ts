export type AbilityScores = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

export type Skill = {
  name: string;
  ability: keyof AbilityScores;
  isProficient: boolean;
};

export type Stat = {
  name: string;
  value: string;
  colSpan: number;
};

export type Weapon = {
  name: string;
  attackBonus: string;
  damageType: string;
  notes: string;
};

export type ClassFeature = {
  name: string;
  description: string;
};

export type SpeciesTrait = {
  name: string;
  description: string;
};

export type Feat = {
  name: string;
  description: string;
};

export type EquipmentItem = {
  name: string;
  notes: string;
};

export type EquipmentProficiencies = {
  armorTraining: {
    light: boolean;
    medium: boolean;
    heavy: boolean;
    shields: boolean;
  };
  weapons: EquipmentItem[];
  tools: EquipmentItem[];
};

export type CharacterData = {
  name: string;
  race: string;
  class: string;
  abilities: AbilityScores;
  background: string;
  subclass: string;
  skills: Skill[];
  stats: Stat[];
  armorClass: number;
  hitPoints: {
    current: number;
    temp: number;
    max: number;
  };
  hitDice: {
    spent: string;
    max: string;
  };
  deathSaves: {
    successes: boolean[];
    failures: boolean[];
  };
  level: number;
  proficiencyBonus: number;
  heroicInspiration: boolean;
  initiative: number;
  speed: string;
  size: string;
  passivePerception: number;
  equipmentProficiencies: EquipmentProficiencies;
  weapons: Weapon[];
  classFeatures: ClassFeature[];
  speciesTraits: SpeciesTrait[];
  feats: Feat[];
  shield?: boolean;
  xp?: number;
};

export const races = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Dragonborn",
  "Tiefling",
];

export const classes = [
  "Warrior",
  "Rogue",
  "Mage",
  "Cleric",
  "Ranger",
  "Paladin",
  "Bard",
  "Warlock",
  "Monk",
  "Druid",
];

export const subclasses: Record<string, string[]> = {
  Warrior: ["Champion", "Battle Master", "Eldritch Knight"],
  Rogue: ["Thief", "Assassin", "Arcane Trickster"],
  Mage: [
    "Evocation",
    "Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Illusion",
    "Necromancy",
    "Transmutation",
  ],
  Cleric: [
    "Life",
    "Light",
    "Nature",
    "Tempest",
    "Trickery",
    "War",
    "Knowledge",
  ],
  Ranger: ["Beast Master", "Hunter", "Gloom Stalker"],
  Paladin: ["Devotion", "Ancients", "Vengeance"],
  Bard: ["Lore", "Valor", "Glamour"],
  Warlock: ["Fiend", "Great Old One", "Archfey"],
  Monk: ["Open Hand", "Shadow", "Four Elements"],
  Druid: ["Land", "Moon", "Stars"],
};

export const backgrounds = [
  "Acolyte",
  "Criminal",
  "Folk Hero",
  "Noble",
  "Sage",
  "Soldier",
];

export const alignments = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];
