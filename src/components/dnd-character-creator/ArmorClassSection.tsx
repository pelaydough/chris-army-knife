import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type ArmorClassSectionProps = {
  armorClass: number;
  hasShield: boolean;
  onInputValueChange: (path: string[], value: string) => void;
  onShieldChange: (checked: boolean) => void;
};

export const ArmorClassSection: React.FC<ArmorClassSectionProps> = ({
  armorClass,
  hasShield,
  onInputValueChange,
  onShieldChange,
}) => {
  return (
    <div className="col-span-1 sm:col-span-3 md:col-span-1 text-card-foreground flex flex-col rounded-xl border p-4 items-center justify-center shadow-sm bg-dark-700 border-dark-500">
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-primary text-center font-bold">Armor Class</h1>
        <Input
          className="text-sm bg-dark-500 p-2 rounded-md w-full text-center mt-4 border-none h-full min-h-0"
          value={armorClass}
          onChange={(e) => onInputValueChange(["armorClass"], e.target.value)}
        />
        <label className="mb-1 mt-4 text-sm text-primary">Shield</label>
        <Checkbox
          checked={hasShield}
          onCheckedChange={(checked) => onShieldChange(checked === true)}
        />
      </div>
    </div>
  );
};
