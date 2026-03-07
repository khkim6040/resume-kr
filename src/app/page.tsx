import Editor from "@/components/editor/Editor";
import Preview from "@/components/preview/Preview";

export default function Home() {
  return (
    <div className="flex h-screen min-w-[1024px] bg-zinc-100">
      <div className="w-[420px] shrink-0 border-r border-zinc-200 bg-zinc-50">
        <Editor />
      </div>
      <div className="flex-1">
        <Preview />
      </div>
    </div>
  );
}
