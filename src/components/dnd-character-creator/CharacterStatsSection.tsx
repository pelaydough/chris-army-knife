import React from "react";
import { Input } from "@/components/ui/input";

type StatItemProps = {
  name: string;
  value: string | number;
  colSpan: number;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

const StatItem: React.FC<StatItemProps> = ({
  name,
  value,
  colSpan,
  readOnly = false,
  onChange,
}) => {
  const getColSpanClass = () => {
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

  return (
    <div
      className={`${getColSpanClass()} text-card-foreground flex flex-col rounded-xl border p-4 items-center justify-center shadow-sm bg-dark-700 border-dark-500`}
    >
      <h1 className="text-primary text-center">{name}</h1>
      <Input
        className="text-sm bg-dark-500 p-2 rounded-md w-full text-center mt-4 border-none"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
};

type CharacterStatsSectionProps = {
  initiative: number;
  speed: string;
  size: string;
  passivePerception: number;
  onInitiativeChange: (value: string) => void;
};

export const CharacterStatsSection: React.FC<CharacterStatsSectionProps> = ({
  initiative,
  speed,
  size,
  passivePerception,
  onInitiativeChange,
}) => {
  return (
    <div className="col-span-8 grid grid-cols-9 gap-4">
      <StatItem
        name="Initiative"
        value={initiative}
        colSpan={2}
        onChange={onInitiativeChange}
      />
      <StatItem name="Speed" value={speed} colSpan={2} readOnly />
      <StatItem name="Size" value={size} colSpan={2} readOnly />
      <StatItem
        name="Passive Perception"
        value={passivePerception}
        colSpan={3}
        readOnly
      />
    </div>
  );
};
