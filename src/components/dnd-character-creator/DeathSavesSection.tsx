import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

type DeathSavesSectionProps = {
  successes: boolean[];
  failures: boolean[];
  onDeathSaveChange: (
    type: "successes" | "failures",
    index: number,
    checked: boolean
  ) => void;
};

export const DeathSavesSection: React.FC<DeathSavesSectionProps> = ({
  successes,
  failures,
  onDeathSaveChange,
}) => {
  return (
    <div className="col-span-1 sm:col-span-2 md:col-span-1 text-card-foreground flex flex-col gap-4 rounded-xl border p-4 items-center shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center font-bold">Death Saves</h1>
      <div className="flex flex-col gap-2 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center space-x-2">
            {successes.map((checked, index) => (
              <Checkbox
                key={`success-${index}`}
                id={`success-${index}`}
                checked={checked}
                onCheckedChange={(checked) =>
                  onDeathSaveChange("successes", index, checked === true)
                }
                className="bg-dark-500"
              />
            ))}
          </div>
          <label className="mt-1 text-sm text-primary">Successes</label>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2">
            {failures.map((checked, index) => (
              <Checkbox
                key={`failure-${index}`}
                id={`failure-${index}`}
                checked={checked}
                onCheckedChange={(checked) =>
                  onDeathSaveChange("failures", index, checked === true)
                }
                className="bg-dark-500"
              />
            ))}
          </div>
          <label className="mt-1 text-sm text-primary">Failures</label>
        </div>
      </div>
    </div>
  );
};
