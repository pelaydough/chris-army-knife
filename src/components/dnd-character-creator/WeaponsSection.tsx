import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkdownEditor } from "./MarkdownEditor";
import { Weapon } from "./types";

type WeaponsSectionProps = {
  weapons: Weapon[];
  addWeapon: () => void;
  updateWeapon: (index: number, field: keyof Weapon, value: string) => void;
};

export const WeaponsSection: React.FC<WeaponsSectionProps> = ({
  weapons,
  addWeapon,
  updateWeapon,
}) => {
  return (
    <div className="col-span-2 grid relative grid-cols-10 gap-4 text-card-foreground rounded-xl border p-4 shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center col-span-10 mb-2">
        Weapons & Damage Cantrips
      </h1>
      <Button
        onClick={addWeapon}
        variant="ghost"
        size="sm"
        className="px-2 py-1 h-auto absolute top-3 right-3 cursor-pointer"
      >
        +
      </Button>
      <div className="col-span-3 mb-1">
        <h2 className="text-primary text-sm">Name</h2>
      </div>
      <div className="col-span-3 mb-1">
        <h2 className="text-primary text-sm">Atk Bonus / DC</h2>
      </div>
      <div className="col-span-3 mb-1">
        <h2 className="text-primary text-sm">Damage Type</h2>
      </div>
      <div className="col-span-1 mb-1">
        <h2 className="text-primary text-sm">Details</h2>
      </div>

      {weapons.length === 0 && (
        <div className="col-span-12 flex justify-center items-center">
          <p className="text-primary py-10">
            You haven't added any weapons or damage cantrips yet.
          </p>
        </div>
      )}

      {weapons.map((weapon, index) => (
        <React.Fragment key={index}>
          <div className="col-span-3">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none"
              value={weapon.name}
              onChange={(e) => updateWeapon(index, "name", e.target.value)}
              placeholder="Weapon name"
            />
          </div>
          <div className="col-span-3">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none"
              value={weapon.attackBonus}
              onChange={(e) =>
                updateWeapon(index, "attackBonus", e.target.value)
              }
              placeholder="+5 or DC 15"
            />
          </div>
          <div className="col-span-3">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none"
              value={weapon.damageType}
              onChange={(e) =>
                updateWeapon(index, "damageType", e.target.value)
              }
              placeholder="1d8 slashing"
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
                    className={weapon.notes ? "text-primary" : "text-gray-500"}
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
                    onChange={(value) => updateWeapon(index, "notes", value)}
                    placeholder="Enter notes about this weapon or cantrip here. You can use markdown formatting for headers, bold text, italic text, etc."
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
