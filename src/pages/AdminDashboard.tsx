import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ThumbsUp, Lightbulb, Zap, TrendingUp, Users, MessageSquare, Clock } from "lucide-react";
import { useAppState, type Insight } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const typeConfig = {
  "Pain point": { icon: AlertTriangle, className: "badge-pain" },
  "Praise": { icon: ThumbsUp, className: "badge-praise" },
  "Suggestion": { icon: Lightbulb, className: "badge-tag" },
};

function InsightCard({ insight }: { insight: Insight }) {
  const { toast } = useToast();
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="insight-card space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className={config.className}>{insight.type}</span>
          <span className="badge-tag">{insight.tag}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {insight.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <blockquote className="text-sm italic text-foreground/80 border-l-2 border-border pl-3">
        "{insight.quote}"
      </blockquote>

      <div className="flex gap-2 flex-wrap">
        <span className="badge-tag">📍 {insight.stage}</span>
        <span className="badge-tag">👤 {insight.segment}</span>
      </div>

      {insight.suggestedAction && (
        <div className="bg-secondary rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-wide">AI Suggested Action</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{insight.suggestedAction}</p>
          <button
            onClick={() => toast({ title: "✅ Action Deployed", description: "Discount codes are being sent to affected users." })}
            className="gold-gradient text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-md text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Deploy Action
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { insights } = useAppState();

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex">
      {/* Stats Sidebar */}
      <div className="w-[280px] flex-shrink-0 border-r border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="font-display text-lg font-semibold">Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time consumer intelligence</p>
        </div>

        {[
          { label: "Live Conversations", value: "1,247", icon: MessageSquare, change: "+12%" },
          { label: "Insights Today", value: String(insights.length + 42), icon: TrendingUp, change: "+8%" },
          { label: "Avg. Response Time", value: "1.2s", icon: Clock, change: "-23%" },
          { label: "Active Users", value: "892", icon: Users, change: "+5%" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg bg-secondary space-y-1">
            <div className="flex items-center justify-between">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] font-medium text-insight-praise">{stat.change}</span>
            </div>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Insight Feed */}
      <div className="flex-1 flex flex-col">
        <div className="px-8 py-4 border-b border-border bg-card flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-insight-pain animate-pulse" />
              Live Insight Feed
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Consumer signals captured from AI conversations</p>
          </div>
          <div className="flex gap-2">
            {["All", "Pain Points", "Praise"].map((f) => (
              <button key={f} className={`text-xs px-3 py-1.5 rounded-full border border-border transition-colors ${f === "All" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-8 space-y-4">
          {insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">Waiting for Insights</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Start a conversation in the Customer App. Insights will appear here in real-time as customers share feedback.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
