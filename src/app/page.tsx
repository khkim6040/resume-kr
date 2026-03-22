"use client";

import Editor from "@/components/editor/Editor";
import Preview from "@/components/preview/Preview";
import { useResizable } from "@/hooks/useResizable";

export default function Home() {
  const { width, handleMouseDown, handleDoubleClick, requestWidth } = useResizable();

  return (
    <div className="flex h-screen min-w-[1024px] bg-zinc-100">
      <div
        className="shrink-0 border-r border-zinc-200 bg-zinc-50"
        style={{ width }}
      >
        <Editor onWidthRequest={requestWidth} />
      </div>
      <div
        className="group relative w-1.5 shrink-0 cursor-col-resize hover:bg-blue-400/40 active:bg-blue-400/60 transition-colors"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>
      <div className="flex-1">
        <Preview />
      </div>
    </div>
  );
}
