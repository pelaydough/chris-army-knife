import React from "react";
import { Input } from "@/components/ui/input";

type HitDiceSectionProps = {
  spent: string;
  max: string;
  onInputValueChange: (path: string[], value: string) => void;
};

export const HitDiceSection: React.FC<HitDiceSectionProps> = ({
  spent,
  max,
  onInputValueChange,
}) => {
  return (
    <div className="col-span-1 sm:col-span-2 md:col-span-1 text-card-foreground flex flex-col gap-4 rounded-xl border p-4 items-center justify-center shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center font-bold">Hit Dice</h1>
      <div className="flex flex-col gap-2 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <Input
            className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none h-full min-h-0"
            value={spent}
            onChange={(e) =>
              onInputValueChange(["hitDice", "spent"], e.target.value)
            }
          />
          <label className="mt-1 text-sm text-primary">Spent</label>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <Input
            className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none h-full min-h-0"
            value={max}
            onChange={(e) =>
              onInputValueChange(["hitDice", "max"], e.target.value)
            }
          />
          <label className="mt-1 text-sm text-primary">Max</label>
        </div>
      </div>
    </div>
  );
};
