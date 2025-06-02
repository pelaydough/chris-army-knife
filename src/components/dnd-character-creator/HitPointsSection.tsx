import React from "react";
import { Input } from "@/components/ui/input";

type HitPointsSectionProps = {
  current: number;
  temp: number;
  max: number;
  onInputValueChange: (path: string[], value: string) => void;
};

export const HitPointsSection: React.FC<HitPointsSectionProps> = ({
  current,
  temp,
  max,
  onInputValueChange,
}) => {
  return (
    <div className="col-span-2 flex flex-col text-card-foreground gap-4 rounded-xl border p-4 items-center justify-center shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center font-bold">Hit Points</h1>
      <div className="flex flex-row w-full h-full gap-4">
        <div className="flex flex-col items-center justify-center w-1/2 h-full">
          <Input
            className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none h-full min-h-0"
            value={current}
            onChange={(e) =>
              onInputValueChange(["hitPoints", "current"], e.target.value)
            }
          />
          <label className="mt-1 text-sm text-primary">Current</label>
        </div>
        <div className="flex flex-col items-center justify-center w-1/2 gap-2 h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none h-full min-h-0"
              value={temp}
              onChange={(e) =>
                onInputValueChange(["hitPoints", "temp"], e.target.value)
              }
            />
            <label className="mt-1 text-sm text-primary">Temp</label>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none h-full min-h-0"
              value={max}
              onChange={(e) =>
                onInputValueChange(["hitPoints", "max"], e.target.value)
              }
            />
            <label className="mt-1 text-sm text-primary">Max</label>
          </div>
        </div>
      </div>
    </div>
  );
};
