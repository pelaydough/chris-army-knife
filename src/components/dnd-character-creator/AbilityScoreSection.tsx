import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getModifier, getSkillModifier } from "./utils";
import { AbilityScores, Skill } from "./types";

type AbilityScoreSectionProps = {
  abilityName: keyof AbilityScores;
  abilityDisplayName: string;
  abilityScore: number;
  skills: Skill[];
  proficiencyBonus: number;
  onAbilityChange: (ability: keyof AbilityScores, value: string) => void;
  onSkillProficiencyChange: (index: number, checked: boolean) => void;
};

export const AbilityScoreSection: React.FC<AbilityScoreSectionProps> = ({
  abilityName,
  abilityDisplayName,
  abilityScore,
  skills,
  proficiencyBonus,
  onAbilityChange,
  onSkillProficiencyChange,
}) => {
  const modifier = getModifier(abilityScore);
  const saveSkill = skills.find(
    (s) => s.name === `${abilityDisplayName} Save` && s.ability === abilityName
  );
  const saveSkillIndex = skills.findIndex(
    (s) => s.name === `${abilityDisplayName} Save` && s.ability === abilityName
  );

  const relatedSkills = skills.filter(
    (skill) => skill.ability === abilityName && !skill.name.includes("Save")
  );

  // Check if this ability has any skills beyond the saving throw
  const hasSkills = relatedSkills.length > 0;

  return (
    <div className="col-span-1 h-fit text-card-foreground flex flex-col rounded-xl border p-4 items-center justify-center shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center">{abilityDisplayName}</h1>
      <div className="flex gap-2">
        <div className="flex flex-col items-center justify-center">
          <Input
            className="text-sm bg-dark-500 p-2 h-16 rounded-md w-full text-center mt-4 border-none"
            value={modifier}
            readOnly
          />
          <label className="mt-1 text-sm text-primary">Modifier</label>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Input
            className="text-sm bg-dark-500 p-2 rounded-md w-full text-center mt-4 border-none"
            value={abilityScore}
            onChange={(e) => onAbilityChange(abilityName, e.target.value)}
          />
          <label className="mt-1 text-sm text-primary">Score</label>
        </div>
      </div>
      <div>
        <div className="mt-4">
          {saveSkill && (
            <div
              className={`flex items-center space-x-2 mb-2 ${
                hasSkills ? "border-b border-dark-500 pb-2" : ""
              }`}
            >
              <Checkbox
                id={`${abilityName}-save`}
                checked={saveSkill.isProficient}
                onCheckedChange={(checked) => {
                  if (saveSkillIndex >= 0) {
                    onSkillProficiencyChange(saveSkillIndex, checked === true);
                  }
                }}
                className="bg-dark-500"
              />
              <Label
                htmlFor={`${abilityName}-save`}
                className="flex-1 cursor-pointer"
              >
                <span className="text-xs text-muted-foreground">
                  {getSkillModifier(
                    abilityScore,
                    saveSkill.isProficient,
                    proficiencyBonus
                  )}
                </span>
                <span className="mr-1">Saving Throw</span>
              </Label>
            </div>
          )}

          {relatedSkills.map((skill) => {
            const skillIndex = skills.findIndex((s) => s.name === skill.name);
            return (
              <div
                key={skill.name}
                className="flex items-center space-x-2 mb-2"
              >
                <Checkbox
                  id={`skill-${skill.name}`}
                  checked={skill.isProficient}
                  onCheckedChange={(checked) => {
                    onSkillProficiencyChange(skillIndex, checked === true);
                  }}
                  className="bg-dark-500"
                />
                <Label
                  htmlFor={`skill-${skill.name}`}
                  className="flex-1 cursor-pointer"
                >
                  <span className="text-xs text-muted-foreground">
                    {getSkillModifier(
                      abilityScore,
                      skill.isProficient,
                      proficiencyBonus
                    )}
                  </span>
                  <span
                    className={`mr-1 ${
                      skill.name.length > 10 ? "text-xs" : ""
                    }`}
                  >
                    {skill.name}
                  </span>
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
