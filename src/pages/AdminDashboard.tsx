import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ThumbsUp, Lightbulb, Zap, TrendingUp, Users, MessageSquare, Clock, X, ChevronRight, Download, ChevronDown, Shield } from "lucide-react";
import { useAppState, type InsightCategory, MOCK_CHART_DATA } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const typeConfig = {
  "Pain point": { icon: AlertTriangle, className: "badge-pain" },
  "Praise": { icon: ThumbsUp, className: "badge-praise" },
  "Suggestion": { icon: Lightbulb, className: "badge-tag" },
};

const severityColors: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

function CategoryCard({ category, onClick }: { category: InsightCategory; onClick: () => void }) {
  const config = typeConfig[category.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="insight-card space-y-3 cursor-pointer hover:border-foreground/20 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Icon className="w-4 h-4" />
          <span className={config.className}>{category.type}</span>
          <span className="badge-tag">{category.tag}</span>
          <span className={`w-2 h-2 rounded-full ${severityColors[category.severity]}`} title={`Severity: ${category.severity}`} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-secondary px-2 py-0.5 rounded-full">
            {category.messages.length} msg{category.messages.length > 1 ? "s" : ""}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>

      <blockquote className="text-sm italic text-foreground/80 border-l-2 border-border pl-3">
        "{category.messages[0]?.quote}"
      </blockquote>

      <div className="flex gap-2 flex-wrap items-center">
        <span className="badge-tag">📍 {category.messages[0]?.stage}</span>
        <span className="badge-tag">👤 {category.messages[0]?.segment}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          Updated {category.updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

function CategoryDetailPanel({ category, onClose }: { category: InsightCategory; onClose: () => void }) {
  const { toast } = useToast();
  const config = typeConfig[category.type];
  const Icon = config.icon;
  const [expandedMessages, setExpandedMessages] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="w-[420px] flex-shrink-0 border-l border-border bg-card flex flex-col overflow-y-auto"
    >
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold">Issue Detail</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 space-y-5 flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <Icon className="w-4 h-4" />
          <span className={config.className}>{category.type}</span>
          <span className="badge-tag">{category.tag}</span>
          <span className={`flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${category.severity === "critical" ? "bg-red-500/20 text-red-400" : category.severity === "high" ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>
            <Shield className="w-3 h-3" />
            {category.severity}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Mentions</p>
            <p className="text-xl font-display font-bold mt-0.5">{category.messages.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Last Report</p>
            <p className="text-sm font-medium mt-0.5">{category.updatedAt.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* AI Resolution */}
        <div className="bg-secondary rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-wide">AI Resolution Plan</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{category.suggestedAction}</p>
          <button
            onClick={() => {
              toast({ title: "✅ Action Deployed", description: "Resolution is being executed across affected users." });
              onClose();
            }}
            className="gold-gradient text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-md text-primary-foreground hover:opacity-90 transition-opacity w-full"
          >
            Deploy Action
          </button>
        </div>

        {/* Related Messages */}
        <div className="space-y-2">
          <button
            onClick={() => setExpandedMessages(!expandedMessages)}
            className="flex items-center gap-2 w-full text-left"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedMessages ? "rotate-0" : "-rotate-90"}`} />
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Related Messages ({category.messages.length})
            </h4>
          </button>

          <AnimatePresence>
            {expandedMessages && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {category.messages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-lg border border-border space-y-1.5">
                    <blockquote className="text-sm italic text-foreground/80 border-l-2 border-border pl-3">
                      "{msg.quote}"
                    </blockquote>
                    <div className="flex gap-2 flex-wrap text-[10px] text-muted-foreground">
                      <span>👤 {msg.segment}</span>
                      <span>📍 {msg.stage}</span>
                      <span>{msg.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { categories } = useAppState();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory | null>(null);
  const [filterType, setFilterType] = useState<string>("All");

  const filtered = filterType === "All"
    ? categories
    : categories.filter(c =>
        filterType === "Pain Points" ? c.type === "Pain point" :
        filterType === "Praise" ? c.type === "Praise" :
        c.type === "Suggestion"
      );

  const totalMessages = categories.reduce((sum, c) => sum + c.messages.length, 0);

  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalCategories: categories.length,
        totalMessages,
        byType: {
          painPoints: categories.filter(c => c.type === "Pain point").length,
          praise: categories.filter(c => c.type === "Praise").length,
          suggestions: categories.filter(c => c.type === "Suggestion").length,
        },
      },
      categories: categories.map(c => ({
        type: c.type,
        tag: c.tag,
        severity: c.severity,
        suggestedAction: c.suggestedAction,
        messageCount: c.messages.length,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        messages: c.messages.map(m => ({
          quote: m.quote,
          segment: m.segment,
          stage: m.stage,
          timestamp: m.timestamp.toISOString(),
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `luxora-insights-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📦 Export Complete", description: `${categories.length} categories and ${totalMessages} messages exported.` });
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex">
      {/* Stats Sidebar */}
      <div className="w-[280px] flex-shrink-0 border-r border-border bg-card p-6 space-y-5 overflow-y-auto scrollbar-thin">
        <div>
          <h2 className="font-display text-lg font-semibold">Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time consumer intelligence</p>
        </div>

        {[
          { label: "Live Conversations", value: "1,247", icon: MessageSquare, change: "+12%" },
          { label: "Issues Tracked", value: String(categories.length), icon: TrendingUp, change: "+8%" },
          { label: "Total Messages", value: String(totalMessages), icon: Clock, change: "+15%" },
          { label: "Active Users", value: "892", icon: Users, change: "+5%" },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-lg bg-secondary space-y-1">
            <div className="flex items-center justify-between">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] font-medium text-insight-praise">{stat.change}</span>
            </div>
            <p className="text-xl font-display font-bold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}

        {/* Charts */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Insights by Type</h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_CHART_DATA.insightsByType} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" stroke="none">
                  {MOCK_CHART_DATA.insightsByType.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {MOCK_CHART_DATA.insightsByType.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                <span className="text-[10px] text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weekly Trend</h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA.insightsOverTime} barSize={8}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} />
                <Bar dataKey="painPoints" fill="hsl(var(--insight-pain))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="praise" fill="hsl(var(--insight-praise))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="suggestions" fill="hsl(var(--insight-suggestion))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Top Tags</h3>
          {MOCK_CHART_DATA.topTags.map(t => (
            <div key={t.tag} className="flex items-center justify-between">
              <span className="text-xs text-foreground">{t.tag}</span>
              <span className="text-xs font-semibold">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Feed */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-8 py-4 border-b border-border bg-card flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-insight-pain animate-pulse" />
              Live Issues & Insights
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Grouped by category • Click to see messages & actions</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            {["All", "Pain Points", "Praise", "Suggestions"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`text-xs px-3 py-1.5 rounded-full border border-border transition-colors ${filterType === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-8 space-y-4">
          <AnimatePresence>
            {filtered.map((category) => (
              <CategoryCard key={category.id} category={category} onClick={() => setSelectedCategory(category)} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedCategory && (
          <CategoryDetailPanel category={selectedCategory} onClose={() => setSelectedCategory(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
