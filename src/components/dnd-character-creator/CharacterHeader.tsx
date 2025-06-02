import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { races, classes, backgrounds, subclasses } from "./types";

type CharacterHeaderProps = {
  name: string;
  race: string;
  characterClass: string;
  background: string;
  subclass: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string, value: string) => void;
};

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  name,
  race,
  characterClass,
  background,
  subclass,
  onInputChange,
  onSelectChange,
}) => {
  const availableSubclasses = characterClass
    ? subclasses[characterClass] || []
    : [];

  return (
    <Card className="bg-dark-700 border-dark-500 col-span-2 sm:col-span-6 xl:col-span-5 py-4">
      <CardContent className="px-4">
        <div className="space-y-4">
          <div>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={onInputChange}
              className="bg-dark-500 text-primary border-none"
            />
            <Label className="mt-1" htmlFor="name">
              Character Name
            </Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                value={race}
                onValueChange={(value) => onSelectChange("race", value)}
              >
                <SelectTrigger className="bg-dark-500 text-primary border-none w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-500 text-primary">
                  {races.map((raceOption) => (
                    <SelectItem
                      className="hover:bg-dark-900 cursor-pointer"
                      key={raceOption}
                      value={raceOption}
                    >
                      {raceOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="mt-1" htmlFor="race">
                Race
              </Label>
            </div>
            <div>
              <Select
                value={characterClass}
                onValueChange={(value) => onSelectChange("class", value)}
              >
                <SelectTrigger className="bg-dark-500 text-primary border-none w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-500 text-primary">
                  {classes.map((classOption) => (
                    <SelectItem
                      className="hover:bg-dark-900 cursor-pointer"
                      key={classOption}
                      value={classOption}
                    >
                      {classOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="mt-1" htmlFor="class">
                Class
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                value={background}
                onValueChange={(value) => onSelectChange("background", value)}
              >
                <SelectTrigger className="bg-dark-500 text-primary border-none w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-500 text-primary">
                  {backgrounds.map((bg) => (
                    <SelectItem
                      className="hover:bg-dark-900 cursor-pointer"
                      key={bg}
                      value={bg}
                    >
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="mt-1" htmlFor="background">
                Background
              </Label>
            </div>
            <div>
              <Select
                value={subclass}
                onValueChange={(value) => onSelectChange("subclass", value)}
                disabled={!characterClass || availableSubclasses.length === 0}
              >
                <SelectTrigger className="bg-dark-500 text-primary border-none w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue
                    placeholder={
                      !characterClass
                        ? "Select a class first"
                        : "Choose subclass"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-dark-500 text-primary">
                  {availableSubclasses.map((subclassOption) => (
                    <SelectItem
                      className="hover:bg-dark-900 cursor-pointer"
                      key={subclassOption}
                      value={subclassOption}
                    >
                      {subclassOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="mt-1" htmlFor="subclass">
                Subclass
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
