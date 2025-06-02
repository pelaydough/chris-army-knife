import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

type HeroicInspirationSectionProps = {
  heroicInspiration: boolean;
  onHeroicInspirationChange: (checked: boolean) => void;
};

export const HeroicInspirationSection: React.FC<
  HeroicInspirationSectionProps
> = ({ heroicInspiration, onHeroicInspirationChange }) => {
  return (
    <div className="col-span-1 text-card-foreground flex flex-col gap-3 rounded-xl border p-4 items-center justify-center shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center">Heroic Inspiration</h1>
      <Checkbox
        id="heroic-inspiration"
        checked={heroicInspiration}
        onCheckedChange={(checked) =>
          onHeroicInspirationChange(checked === true)
        }
      />
    </div>
  );
};
