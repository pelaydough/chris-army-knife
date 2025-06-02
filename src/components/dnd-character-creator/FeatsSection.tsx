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
import { Feat } from "./types";

type FeatsSectionProps = {
  feats: Feat[];
  addFeat: () => void;
  updateFeat: (index: number, field: keyof Feat, value: string) => void;
};

export const FeatsSection: React.FC<FeatsSectionProps> = ({
  feats,
  addFeat,
  updateFeat,
}) => {
  return (
    <div className="col-span-1 grid relative grid-cols-10 gap-4 text-card-foreground rounded-xl border p-4 shadow-sm bg-dark-700 border-dark-500 h-fit">
      <h1 className="text-primary text-center col-span-10 mb-2">Feats</h1>
      <Button
        onClick={addFeat}
        variant="ghost"
        size="sm"
        className="px-2 py-1 h-auto absolute top-3 right-3 cursor-pointer"
      >
        +
      </Button>
      <div className="col-span-8 mb-1">
        <h2 className="text-primary text-sm">Feat Name</h2>
      </div>
      <div className="col-span-2 mb-1">
        <h2 className="text-primary text-sm">Details</h2>
      </div>

      {feats.length === 0 && (
        <div className="col-span-10 flex justify-center items-center">
          <p className="text-primary py-10">You haven't added any feats yet.</p>
        </div>
      )}

      {feats.map((feat, index) => (
        <React.Fragment key={index}>
          <div className="col-span-8">
            <Input
              className="text-sm bg-dark-500 p-2 rounded-md w-full text-center border-none"
              value={feat.name}
              onChange={(e) => updateFeat(index, "name", e.target.value)}
              placeholder="Feat name (e.g., Alert)"
            />
          </div>
          <div className="col-span-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full h-9 flex items-center justify-center cursor-pointer ${
                    feat.description ? "bg-dark-500" : ""
                  }`}
                >
                  <NotepadText
                    className={
                      feat.description ? "text-primary" : "text-gray-500"
                    }
                    size={18}
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dark-700 border-dark-500 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-primary">
                    {feat.name || "Feat"} Details
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-2">
                  <MarkdownEditor
                    value={feat.description}
                    onChange={(value) =>
                      updateFeat(index, "description", value)
                    }
                    placeholder="Describe this feat here. You can use markdown formatting for headers, bold text, italic text, etc."
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
