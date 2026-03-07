import Editor from "@/components/editor/Editor";
import Preview from "@/components/preview/Preview";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="w-[400px] shrink-0 border-r border-zinc-200 bg-white">
        <Editor />
      </div>
      <div className="flex-1">
        <Preview />
      </div>
    </div>
  );
}
