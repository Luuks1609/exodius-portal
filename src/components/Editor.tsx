"use client";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { handleCommandNavigation } from "novel/extensions";
import { useEffect, useState } from "react";

import { defaultExtensions } from "~/lib/novel/extensions";
import { slashCommand, suggestionItems } from "~/lib/novel/slashcommand";
import { defaultEditorContent } from "~/lib/novel/content";
import { TextButtons } from "~/lib/novel/selectors/text-buttons";
import { NodeSelector } from "~/lib/novel/selectors/node-selector";
import { LinkSelector } from "~/lib/novel/selectors/link-selector";
import { ColorSelector } from "~/lib/novel/selectors/color-selector";

import { useDebouncedCallback } from "use-debounce";

const extensions = [...defaultExtensions, slashCommand];

const Editor = ({
  onContentChange,
  editData,
}: {
  onContentChange: (content: string) => void;
  editData: any;
}) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      onContentChange(JSON.stringify(json));
    },
    500,
  );

  return (
    <EditorRoot>
      <EditorContent
        initialContent={editData || null}
        extensions={extensions}
        className="relative h-full w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class:
              "prose prose-neutral prose-headings:font-title font-default focus:outline-none max-w-full",
          },
        }}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);
        }}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-black">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => (item.command ? item.command(val) : null)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <TextButtons />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;
