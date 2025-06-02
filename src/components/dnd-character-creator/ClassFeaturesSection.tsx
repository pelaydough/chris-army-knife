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
import { ClassFeature } from "./types";

type ClassFeaturesSectionProps = {
  classFeatures: ClassFeature[];
  addClassFeature: () => void;
  updateClassFeature: (
    index: number,
    field: keyof ClassFeature,
    value: string
  ) => void;
};

export const ClassFeaturesSection: React.FC<ClassFeaturesSectionProps> = ({
  classFeatures,
  addClassFeature,
  updateClassFeature,
}) => {
  return (
    <div className="col-span-2 grid relative grid-cols-10 gap-4 text-card-foreground rounded-xl border p-4 shadow-sm bg-dark-700 border-dark-500">
      <h1 className="text-primary text-center col-span-10 mb-2">
        Class Features
      </h1>
      <Button
        onClick={addClassFeature}
        variant="ghost"
        size="sm"
        className="px-2 py-1 h-auto absolute top-3 right-3 cursor-pointer"
      >
        +
      </Button>
      <div className="col-span-9 mb-1">
        <h2 className="text-primary text-sm">Feature Name</h2>
      </div>
      <div className="col-span-1 mb-1">
        <h2 className="text-primary text-sm">Details</h2>
      </div>

      {classFeatures.length === 0 && (
        <div className="col-span-10 flex justify-center items-center">
          <p className="text-primary py-10">
            You haven't added any class features yet.
          </p>
        </div>
      )}

      {classFeatures.map((feature, index) => (
        <React.Fragment key={index}>
          <div className="col-span-9">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none"
              value={feature.name}
              onChange={(e) =>
                updateClassFeature(index, "name", e.target.value)
              }
              placeholder="Feature name (e.g., Rage, Sneak Attack, Spellcasting)"
            />
          </div>
          <div className="col-span-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full h-9 flex items-center justify-center cursor-pointer ${
                    feature.description ? "bg-dark-500" : ""
                  }`}
                >
                  <NotepadText
                    className={
                      feature.description ? "text-primary" : "text-gray-500"
                    }
                    size={18}
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dark-700 border-dark-500 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    {feature.name || "Class Feature"} Details
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                  <MarkdownEditor
                    value={feature.description}
                    onChange={(value) =>
                      updateClassFeature(index, "description", value)
                    }
                    placeholder="Describe this class feature here. You can use markdown formatting for headers, bold text, italic text, etc."
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
