import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { NotepadText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkdownEditor } from "./MarkdownEditor";
import { EquipmentItem, EquipmentProficiencies } from "./types";

type EquipmentProficienciesSectionProps = {
  equipmentProficiencies: EquipmentProficiencies;
  onArmorTrainingChange: (
    type: keyof EquipmentProficiencies["armorTraining"],
    checked: boolean
  ) => void;
  addWeapon: () => void;
  updateWeapon: (
    index: number,
    field: keyof EquipmentItem,
    value: string
  ) => void;
  addTool: () => void;
  updateTool: (
    index: number,
    field: keyof EquipmentItem,
    value: string
  ) => void;
};

export const EquipmentProficienciesSection: React.FC<
  EquipmentProficienciesSectionProps
> = ({
  equipmentProficiencies,
  onArmorTrainingChange,
  addWeapon,
  updateWeapon,
  addTool,
  updateTool,
}) => {
  return (
    <div className="col-span-2 text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center mb-4">
        Equipment Training & Proficiencies
      </h1>

      {/* Armor Training Section */}
      <div className="mb-6">
        <h2 className="text-primary text-sm mb-3 text-center">
          Armor Training
        </h2>
        <div className="flex justify-center gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="light-armor"
              checked={equipmentProficiencies.armorTraining.light}
              onCheckedChange={(checked) =>
                onArmorTrainingChange("light", checked as boolean)
              }
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="light-armor"
              className="text-sm text-primary cursor-pointer"
            >
              Light
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="medium-armor"
              checked={equipmentProficiencies.armorTraining.medium}
              onCheckedChange={(checked) =>
                onArmorTrainingChange("medium", checked as boolean)
              }
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="medium-armor"
              className="text-sm text-primary cursor-pointer"
            >
              Medium
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="heavy-armor"
              checked={equipmentProficiencies.armorTraining.heavy}
              onCheckedChange={(checked) =>
                onArmorTrainingChange("heavy", checked as boolean)
              }
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="heavy-armor"
              className="text-sm text-primary cursor-pointer"
            >
              Heavy
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shields"
              checked={equipmentProficiencies.armorTraining.shields}
              onCheckedChange={(checked) =>
                onArmorTrainingChange("shields", checked as boolean)
              }
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor="shields"
              className="text-sm text-primary cursor-pointer"
            >
              Shields
            </label>
          </div>
        </div>
      </div>

      {/* Weapons Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-primary text-sm">Weapons</h2>
          <Button
            onClick={addWeapon}
            variant="ghost"
            size="sm"
            className="px-2 py-1 h-auto text-primary cursor-pointer"
          >
            +
          </Button>
        </div>

        {equipmentProficiencies.weapons.length === 0 ? (
          <p className="text-primary text-sm text-center py-4 opacity-70">
            No weapon proficiencies added yet
          </p>
        ) : (
          <div className="space-y-2">
            {equipmentProficiencies.weapons.map((weapon, index) => (
              <div key={index} className="grid grid-cols-10 gap-2">
                <div className="col-span-9">
                  <Input
                    className="text-sm bg-dark-500 p-2 rounded-md w-full border-none"
                    value={weapon.name}
                    onChange={(e) =>
                      updateWeapon(index, "name", e.target.value)
                    }
                    placeholder="Weapon name (e.g., Longswords, Bows)"
                  />
                </div>
                <div className="col-span-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full h-9 flex items-center justify-center cursor-pointer ${
                          weapon.notes ? "bg-dark-500" : ""
                        }`}
                      >
                        <NotepadText
                          className={
                            weapon.notes ? "text-primary" : "text-gray-500"
                          }
                          size={18}
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-700 border-dark-500">
                      <DialogHeader>
                        <DialogTitle className="text-primary">
                          Details for {weapon.name || "Weapon"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-2">
                        <MarkdownEditor
                          value={weapon.notes}
                          onChange={(value) =>
                            updateWeapon(index, "notes", value)
                          }
                          placeholder="Enter notes about this weapon proficiency here. You can use markdown formatting for headers, bold text, italic text, etc."
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tools Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-primary text-sm">Tools</h2>
          <Button
            onClick={addTool}
            variant="ghost"
            size="sm"
            className="px-2 py-1 h-auto text-primary cursor-pointer"
          >
            +
          </Button>
        </div>

        {equipmentProficiencies.tools.length === 0 ? (
          <p className="text-primary text-sm text-center py-4 opacity-70">
            No tool proficiencies added yet
          </p>
        ) : (
          <div className="space-y-2">
            {equipmentProficiencies.tools.map((tool, index) => (
              <div key={index} className="grid grid-cols-10 gap-2">
                <div className="col-span-9">
                  <Input
                    className="text-sm bg-dark-500 p-2 rounded-md w-full border-none"
                    value={tool.name}
                    onChange={(e) => updateTool(index, "name", e.target.value)}
                    placeholder="Tool name (e.g., Thieves' Tools, Smith's Tools)"
                  />
                </div>
                <div className="col-span-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full h-9 flex items-center justify-center cursor-pointer ${
                          tool.notes ? "bg-dark-500" : ""
                        }`}
                      >
                        <NotepadText
                          className={
                            tool.notes ? "text-primary" : "text-gray-500"
                          }
                          size={18}
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-dark-700 border-dark-500">
                      <DialogHeader>
                        <DialogTitle className="text-primary">
                          Details for {tool.name || "Tool"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-2">
                        <MarkdownEditor
                          value={tool.notes}
                          onChange={(value) =>
                            updateTool(index, "notes", value)
                          }
                          placeholder="Enter notes about this tool proficiency here. You can use markdown formatting for headers, bold text, italic text, etc."
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
