"use client";

import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CharacterHeader,
  CharacterLevelSection,
  ArmorClassSection,
  HitPointsSection,
  HitDiceSection,
  DeathSavesSection,
  AbilityScoreSection,
  CharacterStatsSection,
  WeaponsSection,
  ClassFeaturesSection,
  SpeciesTraitsSection,
  FeatsSection,
  HeroicInspirationSection,
  EquipmentProficienciesSection,
  CharacterData,
  EquipmentProficiencies,
  EquipmentItem,
  getInitialStats,
  updateStatsForRace,
  getRacialSpeedAndSize,
  calculatePassivePerception,
  updateStatsFromAbilities,
  rollAbilityScore,
} from "@/components/dnd-character-creator";

export default function DndCharacterCreator() {
  const initialAbilities = {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  };

  const [character, setCharacter] = useState<CharacterData>({
    name: "",
    race: "",
    class: "",
    level: 1,
    proficiencyBonus: 2,
    abilities: initialAbilities,
    background: "",
    subclass: "",
    skills: [
      // Saving throws
      { name: "Strength Save", ability: "str", isProficient: false },
      { name: "Dexterity Save", ability: "dex", isProficient: false },
      { name: "Constitution Save", ability: "con", isProficient: false },
      { name: "Intelligence Save", ability: "int", isProficient: false },
      { name: "Wisdom Save", ability: "wis", isProficient: false },
      { name: "Charisma Save", ability: "cha", isProficient: false },
      // Skills
      { name: "Acrobatics", ability: "dex", isProficient: false },
      { name: "Animal Handling", ability: "wis", isProficient: false },
      { name: "Arcana", ability: "int", isProficient: false },
      { name: "Athletics", ability: "str", isProficient: false },
      { name: "Deception", ability: "cha", isProficient: false },
      { name: "History", ability: "int", isProficient: false },
      { name: "Insight", ability: "wis", isProficient: false },
      { name: "Intimidation", ability: "cha", isProficient: false },
      { name: "Investigation", ability: "int", isProficient: false },
      { name: "Medicine", ability: "wis", isProficient: false },
      { name: "Nature", ability: "int", isProficient: false },
      { name: "Perception", ability: "wis", isProficient: false },
      { name: "Performance", ability: "cha", isProficient: false },
      { name: "Persuasion", ability: "cha", isProficient: false },
      { name: "Religion", ability: "int", isProficient: false },
      { name: "Sleight of Hand", ability: "dex", isProficient: false },
      { name: "Stealth", ability: "dex", isProficient: false },
      { name: "Survival", ability: "wis", isProficient: false },
    ],
    stats: getInitialStats(initialAbilities),
    armorClass: 10,
    hitPoints: {
      current: 10,
      temp: 0,
      max: 10,
    },
    hitDice: {
      spent: "1d8",
      max: "1d8",
    },
    deathSaves: {
      successes: [false, false, false],
      failures: [false, false, false],
    },
    heroicInspiration: false,
    initiative: Math.floor((initialAbilities.dex - 10) / 2),
    speed: "30ft",
    size: "M",
    passivePerception: 10 + Math.floor((initialAbilities.wis - 10) / 2),
    equipmentProficiencies: {
      armorTraining: {
        light: false,
        medium: false,
        heavy: false,
        shields: false,
      },
      weapons: [],
      tools: [],
    },
    weapons: [],
    classFeatures: [],
    speciesTraits: [],
    feats: [],
  });

  const rollAllAbilities = (): void => {
    const newAbilities = {
      str: rollAbilityScore(),
      dex: rollAbilityScore(),
      con: rollAbilityScore(),
      int: rollAbilityScore(),
      wis: rollAbilityScore(),
      cha: rollAbilityScore(),
    };

    setCharacter({
      ...character,
      abilities: newAbilities,
      stats: updateStatsFromAbilities(newAbilities, character.race),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCharacter({ ...character, [name]: value });
  };

  const handleSelectChange = (field: string, value: string): void => {
    if (field === "race") {
      // Get racial speed and size
      const { speed, size } = getRacialSpeedAndSize(value);

      // Update stats based on race
      setCharacter((prev) => ({
        ...prev,
        [field]: value,
        stats: updateStatsForRace(value, prev.abilities),
        speed: speed,
        size: size,
      }));
    } else if (field === "class") {
      // Reset subclass when class changes
      setCharacter((prev) => ({
        ...prev,
        [field]: value,
        subclass: "", // Reset subclass when class changes
      }));
    } else {
      setCharacter((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAbilityChange = (
    ability: keyof typeof initialAbilities,
    value: string
  ): void => {
    const newValue = parseInt(value) || 0;
    const newAbilities = {
      ...character.abilities,
      [ability]: newValue,
    };

    const newStats = updateStatsFromAbilities(newAbilities, character.race);
    let newPassivePerception = character.passivePerception;
    let newInitiative = character.initiative;

    // Update passive perception if wisdom changes
    if (ability === "wis") {
      const perceptionSkill = character.skills.find(
        (skill) => skill.name === "Perception"
      );
      newPassivePerception = calculatePassivePerception(
        newValue,
        perceptionSkill?.isProficient || false,
        character.proficiencyBonus
      );
    }

    // Update initiative if dexterity changes
    if (ability === "dex") {
      newInitiative = Math.floor((newValue - 10) / 2);
    }

    setCharacter({
      ...character,
      abilities: newAbilities,
      stats: newStats,
      passivePerception: newPassivePerception,
      initiative: newInitiative,
    });
  };

  const handleSkillProficiencyChange = (index: number, checked: boolean) => {
    setCharacter((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = {
        ...updatedSkills[index],
        isProficient: checked,
      };

      // Update passive perception if perception skill changes
      let newPassivePerception = prev.passivePerception;
      if (updatedSkills[index].name === "Perception") {
        newPassivePerception = calculatePassivePerception(
          prev.abilities.wis,
          checked,
          prev.proficiencyBonus
        );
      }

      return {
        ...prev,
        skills: updatedSkills,
        passivePerception: newPassivePerception,
      };
    });
  };

  const handleInputValueChange = (path: string[], value: string) => {
    setCharacter((prev) => {
      const newCharacter = { ...prev };
      let current: Record<string, unknown> = newCharacter;

      // Navigate to the nested property
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] as Record<string, unknown>;
      }

      // Set the value (convert to number if needed)
      const lastKey = path[path.length - 1];
      current[lastKey] = [
        "current",
        "temp",
        "max",
        "armorClass",
        "level",
      ].includes(lastKey)
        ? parseInt(value) || 0
        : value;

      return newCharacter;
    });
  };

  const handleDeathSaveChange = (
    type: "successes" | "failures",
    index: number,
    checked: boolean
  ) => {
    setCharacter((prev) => {
      const newDeathSaves = { ...prev.deathSaves };
      newDeathSaves[type][index] = checked;
      return { ...prev, deathSaves: newDeathSaves };
    });
  };

  const handleShieldChange = (checked: boolean) => {
    setCharacter((prev) => ({
      ...prev,
      shield: checked,
      armorClass: checked ? prev.armorClass + 2 : prev.armorClass - 2,
    }));
  };

  const addWeapon = () => {
    setCharacter((prev) => ({
      ...prev,
      weapons: [
        ...prev.weapons,
        { name: "", attackBonus: "", damageType: "", notes: "" },
      ],
    }));
  };

  const updateWeapon = (
    index: number,
    field: keyof (typeof character.weapons)[0],
    value: string
  ) => {
    setCharacter((prev) => {
      const newWeapons = [...prev.weapons];
      newWeapons[index] = { ...newWeapons[index], [field]: value };
      return { ...prev, weapons: newWeapons };
    });
  };

  const addClassFeature = () => {
    setCharacter((prev) => ({
      ...prev,
      classFeatures: [...prev.classFeatures, { name: "", description: "" }],
    }));
  };

  const updateClassFeature = (
    index: number,
    field: keyof (typeof character.classFeatures)[0],
    value: string
  ) => {
    setCharacter((prev) => {
      const newClassFeatures = [...prev.classFeatures];
      newClassFeatures[index] = { ...newClassFeatures[index], [field]: value };
      return { ...prev, classFeatures: newClassFeatures };
    });
  };

  const addSpeciesTrait = () => {
    setCharacter((prev) => ({
      ...prev,
      speciesTraits: [...prev.speciesTraits, { name: "", description: "" }],
    }));
  };

  const updateSpeciesTrait = (
    index: number,
    field: keyof (typeof character.speciesTraits)[0],
    value: string
  ) => {
    setCharacter((prev) => {
      const newSpeciesTraits = [...prev.speciesTraits];
      newSpeciesTraits[index] = { ...newSpeciesTraits[index], [field]: value };
      return { ...prev, speciesTraits: newSpeciesTraits };
    });
  };

  const addFeat = () => {
    setCharacter((prev) => ({
      ...prev,
      feats: [...prev.feats, { name: "", description: "" }],
    }));
  };

  const updateFeat = (
    index: number,
    field: keyof (typeof character.feats)[0],
    value: string
  ) => {
    setCharacter((prev) => {
      const newFeats = [...prev.feats];
      newFeats[index] = { ...newFeats[index], [field]: value };
      return { ...prev, feats: newFeats };
    });
  };

  const handleArmorTrainingChange = (
    type: keyof EquipmentProficiencies["armorTraining"],
    checked: boolean
  ) => {
    setCharacter((prev) => ({
      ...prev,
      equipmentProficiencies: {
        ...prev.equipmentProficiencies,
        armorTraining: {
          ...prev.equipmentProficiencies.armorTraining,
          [type]: checked,
        },
      },
    }));
  };

  const addEquipmentWeapon = () => {
    setCharacter((prev) => ({
      ...prev,
      equipmentProficiencies: {
        ...prev.equipmentProficiencies,
        weapons: [
          ...prev.equipmentProficiencies.weapons,
          { name: "", notes: "" },
        ],
      },
    }));
  };

  const updateEquipmentWeapon = (
    index: number,
    field: keyof EquipmentItem,
    value: string
  ) => {
    setCharacter((prev) => {
      const newWeapons = [...prev.equipmentProficiencies.weapons];
      newWeapons[index] = { ...newWeapons[index], [field]: value };
      return {
        ...prev,
        equipmentProficiencies: {
          ...prev.equipmentProficiencies,
          weapons: newWeapons,
        },
      };
    });
  };

  const addEquipmentTool = () => {
    setCharacter((prev) => ({
      ...prev,
      equipmentProficiencies: {
        ...prev.equipmentProficiencies,
        tools: [...prev.equipmentProficiencies.tools, { name: "", notes: "" }],
      },
    }));
  };

  const updateEquipmentTool = (
    index: number,
    field: keyof EquipmentItem,
    value: string
  ) => {
    setCharacter((prev) => {
      const newTools = [...prev.equipmentProficiencies.tools];
      newTools[index] = { ...newTools[index], [field]: value };
      return {
        ...prev,
        equipmentProficiencies: {
          ...prev.equipmentProficiencies,
          tools: newTools,
        },
      };
    });
  };

  return (
    <div className="tool-container !pt-0 max-w-screen-xl mx-auto bg-dark-900 text-primary">
      <div className="grid grid-cols-12 gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-6 xl:grid-cols-11 col-span-12 gap-4">
          {/* Character Details */}
          <CharacterHeader
            name={character.name}
            race={character.race}
            characterClass={character.class}
            background={character.background}
            subclass={character.subclass}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />

          {/* Character Level */}
          <CharacterLevelSection
            level={character.level}
            onInputValueChange={handleInputValueChange}
          />

          {/* Armor Class */}
          <ArmorClassSection
            armorClass={character.armorClass}
            hasShield={character.shield || false}
            onInputValueChange={handleInputValueChange}
            onShieldChange={handleShieldChange}
          />

          {/* Hit Points */}
          <HitPointsSection
            current={character.hitPoints.current}
            temp={character.hitPoints.temp}
            max={character.hitPoints.max}
            onInputValueChange={handleInputValueChange}
          />

          {/* Hit Dice */}
          <HitDiceSection
            spent={character.hitDice.spent}
            max={character.hitDice.max}
            onInputValueChange={handleInputValueChange}
          />

          {/* Death Saves */}
          <DeathSavesSection
            successes={character.deathSaves.successes}
            failures={character.deathSaves.failures}
            onDeathSaveChange={handleDeathSaveChange}
          />
        </div>

        <div className="grid grid-cols-2 col-span-12 xl:col-span-4 gap-4">
          <div className="col-span-1 grid md:grid-cols-2 xl:grid-cols-1 gap-4">
            <div className="col-span-1 h-fit text-card-foreground flex flex-col rounded-xl border p-4 items-center justify-center shadow-sm bg-dark-700 border-dark-500">
              <h1 className="text-primary text-center text-sm">
                Proficiency Bonus
              </h1>
              <Input
                className="text-sm bg-dark-500 p-2 rounded-md w-full text-center mt-4 border-none"
                value={character.proficiencyBonus}
                onChange={(e) =>
                  handleInputValueChange(["proficiencyBonus"], e.target.value)
                }
              />
            </div>

            {/* Ability Scores - Left Column */}
            <AbilityScoreSection
              abilityName="str"
              abilityDisplayName="Strength"
              abilityScore={character.abilities.str}
              skills={character.skills}
              proficiencyBonus={character.proficiencyBonus}
              onAbilityChange={handleAbilityChange}
              onSkillProficiencyChange={handleSkillProficiencyChange}
            />

            <AbilityScoreSection
              abilityName="dex"
              abilityDisplayName="Dexterity"
              abilityScore={character.abilities.dex}
              skills={character.skills}
              proficiencyBonus={character.proficiencyBonus}
              onAbilityChange={handleAbilityChange}
              onSkillProficiencyChange={handleSkillProficiencyChange}
            />

            <AbilityScoreSection
              abilityName="con"
              abilityDisplayName="Constitution"
              abilityScore={character.abilities.con}
              skills={character.skills}
              proficiencyBonus={character.proficiencyBonus}
              onAbilityChange={handleAbilityChange}
              onSkillProficiencyChange={handleSkillProficiencyChange}
            />

            <HeroicInspirationSection
              heroicInspiration={character.heroicInspiration}
              onHeroicInspirationChange={(checked) =>
                setCharacter((prev) => ({
                  ...prev,
                  heroicInspiration: checked,
                }))
              }
            />
          </div>

          <div className="col-span-1 grid md:grid-cols-2 xl:grid-cols-1 gap-4">
            {/* Ability Scores - Right Column */}
            <AbilityScoreSection
              abilityName="int"
              abilityDisplayName="Intelligence"
              abilityScore={character.abilities.int}
              skills={character.skills}
              proficiencyBonus={character.proficiencyBonus}
              onAbilityChange={handleAbilityChange}
              onSkillProficiencyChange={handleSkillProficiencyChange}
            />

            <AbilityScoreSection
              abilityName="wis"
              abilityDisplayName="Wisdom"
              abilityScore={character.abilities.wis}
              skills={character.skills}
              proficiencyBonus={character.proficiencyBonus}
              onAbilityChange={handleAbilityChange}
              onSkillProficiencyChange={handleSkillProficiencyChange}
            />

            <AbilityScoreSection
              abilityName="cha"
              abilityDisplayName="Charisma"
              abilityScore={character.abilities.cha}
              skills={character.skills}
              proficiencyBonus={character.proficiencyBonus}
              onAbilityChange={handleAbilityChange}
              onSkillProficiencyChange={handleSkillProficiencyChange}
            />
          </div>

          <EquipmentProficienciesSection
            equipmentProficiencies={character.equipmentProficiencies}
            onArmorTrainingChange={handleArmorTrainingChange}
            addWeapon={addEquipmentWeapon}
            updateWeapon={updateEquipmentWeapon}
            addTool={addEquipmentTool}
            updateTool={updateEquipmentTool}
          />
        </div>

        <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">
          {/* Character Stats Section */}
          <CharacterStatsSection
            initiative={character.initiative}
            speed={character.speed}
            size={character.size}
            passivePerception={character.passivePerception}
            onInitiativeChange={(value) =>
              handleInputValueChange(["initiative"], value)
            }
          />

          <div className="col-span-8 grid grid-cols-2 gap-4">
            {/* Weapons Section */}
            <WeaponsSection
              weapons={character.weapons}
              addWeapon={addWeapon}
              updateWeapon={updateWeapon}
            />

            {/* Class Features Section */}
            <ClassFeaturesSection
              classFeatures={character.classFeatures}
              addClassFeature={addClassFeature}
              updateClassFeature={updateClassFeature}
            />

            {/* Species Traits Section */}
            <SpeciesTraitsSection
              speciesTraits={character.speciesTraits}
              addSpeciesTrait={addSpeciesTrait}
              updateSpeciesTrait={updateSpeciesTrait}
            />

            {/* Feats Section */}
            <FeatsSection
              feats={character.feats}
              addFeat={addFeat}
              updateFeat={updateFeat}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button
          onClick={rollAllAbilities}
          className="rounded-full w-12 h-12 bg-primary text-dark-900 hover:bg-primary/90"
        >
          <Dices size={24} />
        </Button>
      </div>
    </div>
  );
}
