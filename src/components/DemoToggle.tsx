import { useAppState, type DemoState } from "@/lib/store";

export function DemoToggle() {
  const { demoState, setDemoState } = useAppState();

  return (
    <div className="absolute bottom-20 left-6 z-10">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs">
        <span className="text-muted-foreground font-medium">Demo:</span>
        {(["new", "returning"] as DemoState[]).map((s) => (
          <button
            key={s}
            onClick={() => setDemoState(s)}
            className={`px-2.5 py-1 rounded-full transition-all text-xs font-medium ${
              demoState === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "new" ? "New User" : "Sarah (Returning)"}
          </button>
        ))}
      </div>
    </div>
  );
}
