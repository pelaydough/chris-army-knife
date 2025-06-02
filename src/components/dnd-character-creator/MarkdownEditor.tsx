import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Hash, Eye, Edit, List } from "lucide-react";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

// Simple markdown parser for basic formatting
const parseMarkdown = (text: string): string => {
  if (!text) return "";

  let html = text;

  // Headers (# ## ###) - must be at start of line
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-lg font-semibold text-primary mb-1 mt-2">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-xl font-semibold text-primary mb-1 mt-2">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-2xl font-bold text-primary mb-1 mt-2">$1</h1>'
  );

  // Bold text (**text**)
  html = html.replace(
    /\*\*([^\*\n]+?)\*\*/g,
    '<strong class="font-bold text-primary">$1</strong>'
  );

  // Italic text (*text*) - avoid conflict with bold
  html = html.replace(
    /(?<!\*)\*([^\*\n]+?)\*(?!\*)/g,
    '<em class="italic text-primary">$1</em>'
  );

  // Convert unordered lists (- item)
  html = html.replace(/^- (.+)$/gm, '<li class="text-primary ml-4">• $1</li>');

  // Wrap consecutive list items in ul tags
  html = html.replace(
    /(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g,
    function (match) {
      return '<ul class="mb-2">' + match + "</ul>";
    }
  );

  // Convert double line breaks to paragraphs
  html = html.replace(/\n\s*\n/g, '</p><p class="mb-2">');

  // Wrap in paragraph if content doesn't start with a header or list
  if (html && !html.startsWith("<h") && !html.startsWith("<ul")) {
    html = '<p class="mb-2">' + html + "</p>";
  } else if (html) {
    html = html + "<p></p>"; // Add closing paragraph for headers
  }

  // Clean up empty paragraphs
  html = html.replace(/<p class="mb-2"><\/p>/g, "");
  html = html.replace(/<p><\/p>/g, "");

  return html;
};

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content here...",
  className = "",
}) => {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(
    null
  );
  const [isPreview, setIsPreview] = useState(value.trim().length > 0);

  const insertText = (before: string, after: string = "") => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length
        );
        textareaRef.focus();
      }
    }, 0);
  };

  const formatBold = () => insertText("**", "**");
  const formatItalic = () => insertText("*", "*");
  const formatHeader1 = () => insertText("# ");
  const formatHeader2 = () => insertText("## ");
  const formatHeader3 = () => insertText("### ");
  const formatList = () => insertText("- ");

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-1 p-2 bg-dark-600 rounded-md border-none justify-between">
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatHeader1}
            className="h-8 px-2 text-primary hover:bg-dark-500"
            title="Header 1"
            disabled={isPreview}
          >
            <Hash size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatHeader2}
            className="h-8 px-2 text-primary hover:bg-dark-500"
            title="Header 2"
            disabled={isPreview}
          >
            <Hash size={12} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatHeader3}
            className="h-8 px-2 text-primary hover:bg-dark-500"
            title="Header 3"
            disabled={isPreview}
          >
            <Hash size={10} />
          </Button>
          <div className="w-px bg-dark-500 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatBold}
            className="h-8 px-2 text-primary hover:bg-dark-500"
            title="Bold"
            disabled={isPreview}
          >
            <Bold size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatItalic}
            className="h-8 px-2 text-primary hover:bg-dark-500"
            title="Italic"
            disabled={isPreview}
          >
            <Italic size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatList}
            className="h-8 px-2 text-primary hover:bg-dark-500"
            title="List Item"
            disabled={isPreview}
          >
            <List size={14} />
          </Button>
        </div>

        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(false)}
            className={`h-8 px-2 hover:bg-dark-500 ${
              !isPreview ? "bg-dark-500 text-primary" : "text-gray-400"
            }`}
            title="Edit"
          >
            <Edit size={14} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(true)}
            className={`h-8 px-2 hover:bg-dark-500 ${
              isPreview ? "bg-dark-500 text-primary" : "text-gray-400"
            }`}
            title="Preview"
          >
            <Eye size={14} />
          </Button>
        </div>
      </div>

      {isPreview ? (
        <div
          className="bg-dark-500 text-primary border-none min-h-[200px] w-full p-3 rounded-md overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html:
              parseMarkdown(value) ||
              '<p class="text-gray-400">No content to preview...</p>',
          }}
        />
      ) : (
        <Textarea
          ref={setTextareaRef}
          className="bg-dark-500 text-primary border-none min-h-[200px] w-full resize-y"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <div className="text-xs text-gray-400 mt-1">
        {isPreview
          ? "Previewing formatted content - click Edit to continue editing"
          : "Supports: **bold**, *italic*, # headers, - lists - click Preview to see formatting"}
      </div>
    </div>
  );
};
