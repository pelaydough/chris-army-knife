import React from "react";
import { Input } from "@/components/ui/input";

type CharacterLevelSectionProps = {
  level: number;
  onInputValueChange: (path: string[], value: string) => void;
};

export const CharacterLevelSection: React.FC<CharacterLevelSectionProps> = ({
  level,
  onInputValueChange,
}) => {
  return (
    <div className="col-span-1 sm:col-span-3 md:col-span-1 text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm bg-dark-700 border-dark-500 h-full">
      <div className="flex flex-col h-full space-y-4">
        <div className="h-2/3 flex flex-col">
          <div className="flex-1 flex flex-col">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none h-full min-h-0"
              value={level}
              onChange={(e) => onInputValueChange(["level"], e.target.value)}
            />
            <label className="text-primary text-center text-sm mt-1">
              Level
            </label>
          </div>
        </div>
        <div className="h-1/3 flex flex-col">
          <div className="flex-1 flex flex-col">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none h-full min-h-0"
              value="0"
              onChange={(e) => onInputValueChange(["xp"], e.target.value)}
            />
            <label className="text-primary text-center text-sm mt-1">XP</label>
          </div>
        </div>
      </div>
    </div>
  );
};
