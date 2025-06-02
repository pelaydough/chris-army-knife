import { AbilityScores, Stat } from "./types";

export const getModifier = (score: number): string => {
  const modifier = Math.floor((score - 10) / 2);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export const getInitialStats = (abilities: AbilityScores): Stat[] => {
  return [
    { name: "Perception", value: getModifier(abilities.wis), colSpan: 4 },
    {
      name: "Initiative",
      value: getModifier(abilities.dex),
      colSpan: 3,
    },
    { name: "Speed", value: "30ft", colSpan: 3 },
    { name: "Size", value: "M", colSpan: 2 },
  ];
};

export const getRacialSpeedAndSize = (
  race: string
): { speed: string; size: string } => {
  switch (race.toLowerCase()) {
    case "dwarf":
      return { speed: "25ft", size: "M" };
    case "halfling":
      return { speed: "25ft", size: "S" };
    case "gnome":
      return { speed: "25ft", size: "S" };
    case "elf":
      return { speed: "35ft", size: "M" };
    case "half-orc":
      return { speed: "30ft", size: "M" };
    case "dragonborn":
      return { speed: "30ft", size: "M" };
    case "tiefling":
      return { speed: "30ft", size: "M" };
    case "half-elf":
      return { speed: "30ft", size: "M" };
    case "human":
    default:
      return { speed: "30ft", size: "M" };
  }
};

export const updateStatsForRace = (
  race: string,
  abilities: AbilityScores
): Stat[] => {
  const { speed, size } = getRacialSpeedAndSize(race);

  return [
    { name: "Perception", value: getModifier(abilities.wis), colSpan: 4 },
    {
      name: "Initiative",
      value: getModifier(abilities.dex),
      colSpan: 3,
    },
    { name: "Speed", value: speed, colSpan: 3 },
    { name: "Size", value: size, colSpan: 2 },
  ];
};

export const updateStatsFromAbilities = (
  abilities: AbilityScores,
  race: string
): Stat[] => {
  // Calculate perception based on wisdom
  const perceptionValue = getModifier(abilities.wis);

  // Calculate initiative based on dexterity
  const initiativeValue = getModifier(abilities.dex);

  // Get speed and size based on race
  const { speed, size } = getRacialSpeedAndSize(race);

  // Update stats with new values
  return [
    { name: "Perception", value: perceptionValue, colSpan: 4 },
    { name: "Initiative", value: initiativeValue, colSpan: 3 },
    { name: "Speed", value: speed, colSpan: 3 },
    { name: "Size", value: size, colSpan: 2 },
  ];
};

export const calculatePassivePerception = (
  wisdom: number,
  isProficient: boolean,
  proficiencyBonus: number
): number => {
  const wisModifier = Math.floor((wisdom - 10) / 2);
  const bonus = isProficient ? proficiencyBonus : 0;
  return 10 + wisModifier + bonus;
};

export const getSkillModifier = (
  abilityScore: number,
  isProficient: boolean,
  proficiencyBonus: number
): string => {
  const baseModifier = Math.floor((abilityScore - 10) / 2);
  const totalModifier = baseModifier + (isProficient ? proficiencyBonus : 0);
  return totalModifier >= 0 ? `+${totalModifier}` : `${totalModifier}`;
};

export const rollDice = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};

export const rollAbilityScore = (): number => {
  const rolls = [rollDice(), rollDice(), rollDice(), rollDice()];
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((sum, roll) => sum + roll, 0);
};

export const getStatColSpanClass = (colSpan: number): string => {
  switch (colSpan) {
    case 2:
      return "col-span-2";
    case 3:
      return "col-span-3";
    case 4:
      return "col-span-4";
    default:
      return "col-span-1";
  }
};
