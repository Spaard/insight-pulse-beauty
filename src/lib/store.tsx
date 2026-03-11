import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types
export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  revealProducts?: string[]; // product IDs to reveal after this message
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  tag?: string;
}

export interface Insight {
  id: string;
  type: "Pain point" | "Praise" | "Suggestion";
  tag: string;
  stage: string;
  segment: string;
  quote: string;
  timestamp: Date;
  suggestedAction?: string;
}

export type DemoState = "new" | "returning" | "abandoned";

// Mock Data
const ALL_PRODUCTS: Product[] = [
  { id: "1", name: "Gloss Bomb Universal Lip Luminizer", brand: "Fenty Beauty", price: "$22", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300&h=300&fit=crop", tag: "Best Seller" },
  { id: "2", name: "J'adore Eau de Parfum", brand: "Dior", price: "$155", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop", tag: "Trending" },
  { id: "3", name: "Black Opium Eau de Parfum", brand: "YSL", price: "$142", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=300&h=300&fit=crop" },
  { id: "4", name: "Soft Matte Complete Foundation", brand: "NARS", price: "$42", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", tag: "Editor's Pick" },
  { id: "5", name: "Advanced Génifique Eye Cream", brand: "Lancôme", price: "$68", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=300&h=300&fit=crop", tag: "Complement" },
  { id: "6", name: "Hydra Beauty Micro Sérum", brand: "Chanel", price: "$120", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&h=300&fit=crop", tag: "Recommended" },
  { id: "7", name: "Vitamin C Serum", brand: "La Roche-Posay", price: "$45", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop" },
  { id: "8", name: "SPF 50 UV Protect", brand: "Supergoop!", price: "$36", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop", tag: "Essential" },
];

const GREETINGS: Record<DemoState, ChatMessage> = {
  new: {
    id: "init-new",
    role: "ai",
    content: "Welcome to Sephora! ✨ I'm your AI Personal Shopper. Are you looking for skincare, makeup, or fragrance today?",
    timestamp: new Date(),
  },
  returning: {
    id: "init-returning",
    role: "ai",
    content: "Welcome back, Sarah! 💫 I see you ordered the **Lancôme Advanced Génifique Serum** last month. I'd love to hear about your experience — how's the product itself? And how was the overall purchase experience (delivery, packaging, condition on arrival)?",
    timestamp: new Date(),
  },
  abandoned: {
    id: "init-abandoned",
    role: "ai",
    content: "Hey! 👋 I noticed you were looking at the **Dior J'adore Eau de Parfum** last time but didn't go through with it. Would you like to pick up where you left off, or explore something different? I'm curious — was there something that held you back?",
    timestamp: new Date(),
  },
};

// Conversational AI responses per state — progressive product reveals
function getAIResponse(message: string, demoState: DemoState, turnIndex: number): { reply: string; insight?: Omit<Insight, "id" | "timestamp">; revealProducts?: string[] } {
  const lower = message.toLowerCase();

  if (demoState === "new") {
    if (lower.includes("skincare") || lower.includes("skin")) {
      return {
        reply: "Great choice! Skincare is all about finding what works for your unique skin. I'd recommend starting with this — it's one of our most-loved serums right now. What does your current routine look like?",
        revealProducts: ["7"],
        insight: { type: "Suggestion", tag: "Product Interest", stage: "Discovery", segment: "New User", quote: message },
      };
    }
    if (lower.includes("makeup") || lower.includes("foundation") || lower.includes("lipstick")) {
      return {
        reply: "Love it! Let me start with something universally flattering — this Fenty Gloss is a fan favorite. What's the occasion? Everyday look, night out, or special event?",
        revealProducts: ["1"],
        insight: { type: "Suggestion", tag: "Product Interest", stage: "Discovery", segment: "New User", quote: message },
      };
    }
    if (lower.includes("fragrance") || lower.includes("perfume") || lower.includes("parfum")) {
      return {
        reply: "Fragrance is so personal — I love helping with that. Here's a timeless option to start. Do you tend to prefer fresh & light, or warm & intense scents?",
        revealProducts: ["2"],
        insight: { type: "Suggestion", tag: "Product Interest", stage: "Discovery", segment: "New User", quote: message },
      };
    }
    // Follow-up turns — reveal more products
    if (turnIndex >= 2) {
      return {
        reply: "Based on what you've shared, I think you'd also love this. Shall I add a sample to your cart so you can try it risk-free?",
        revealProducts: ["4"],
        insight: { type: "Suggestion", tag: "General Feedback", stage: "Discovery", segment: "New User", quote: message },
      };
    }
    return {
      reply: "I'd love to help! Are you leaning towards skincare, makeup, or fragrance? Or I can suggest something based on what's trending right now 🔥",
    };
  }

  if (demoState === "returning") {
    if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("slow") || lower.includes("week") || lower.includes("livraison")) {
      return {
        reply: "I'm really sorry to hear that, Sarah. Two weeks is way too long — you deserve better. I've flagged this with our logistics team and I'd like to offer you complimentary express shipping on your next order. In the meantime, I think your skin would love this eye cream as a complement to your serum 💫",
        revealProducts: ["5"],
        insight: {
          type: "Pain point",
          tag: "Delivery/Shipping",
          stage: "Post-purchase",
          segment: "Returning User",
          quote: message,
          suggestedAction: "Alert: 15 mentions of slow shipping today. Recommend sending a 15% apology discount code to affected users.",
        },
      };
    }
    if (lower.includes("great") || lower.includes("love") || lower.includes("amazing") || lower.includes("good") || lower.includes("super") || lower.includes("bien") || lower.includes("adore")) {
      return {
        reply: "That's wonderful to hear! 🎉 Since your skin is responding so well, I think you'd absolutely adore this — it uses the same microbiome science for the delicate eye area. Want me to add a sample to your next order?",
        revealProducts: ["5"],
        insight: {
          type: "Praise",
          tag: "Product Satisfaction",
          stage: "Post-purchase",
          segment: "Returning User",
          quote: message,
        },
      };
    }
    if (lower.includes("damaged") || lower.includes("broken") || lower.includes("abîmé") || lower.includes("cassé") || lower.includes("packaging")) {
      return {
        reply: "Oh no, I'm so sorry about that! Product arriving damaged is unacceptable. I'm immediately processing a free replacement for you. We'll also flag this with our warehouse team. In the meantime, here's something I think you'll enjoy 💛",
        revealProducts: ["6"],
        insight: {
          type: "Pain point",
          tag: "Product Condition",
          stage: "Post-purchase",
          segment: "Returning User",
          quote: message,
          suggestedAction: "Alert: Packaging damage reports increasing. Recommend audit of fulfillment packaging process.",
        },
      };
    }
    return {
      reply: "Thank you for sharing, Sarah! Your feedback is incredibly valuable. Based on what you've told me, I have a recommendation that I think you'll love — shall I show you?",
      revealProducts: turnIndex >= 2 ? ["6"] : undefined,
      insight: {
        type: "Suggestion",
        tag: "General Feedback",
        stage: "Post-purchase",
        segment: "Returning User",
        quote: message,
      },
    };
  }

  // abandoned
  if (lower.includes("price") || lower.includes("expensive") || lower.includes("cher") || lower.includes("budget") || lower.includes("prix")) {
    return {
      reply: "Totally understandable! $155 is a commitment. Here's a beautiful alternative at a more comfortable price point — and I can also check if we have any promotions coming up for the J'adore. Would that help?",
      revealProducts: ["3"],
      insight: {
        type: "Pain point",
        tag: "Pricing",
        stage: "Pre-purchase",
        segment: "Browse Abandoner",
        quote: message,
        suggestedAction: "Alert: 23 browse abandonments citing price on premium fragrances. Consider a 'First Purchase' 10% discount campaign.",
      },
    };
  }
  if (lower.includes("yes") || lower.includes("oui") || lower.includes("sure") || lower.includes("ok") || lower.includes("same") || lower.includes("continue") || lower.includes("reprendre")) {
    return {
      reply: "Perfect! Here's the J'adore again — still as gorgeous as ever. If you'd like, I can also show you a few similar options so you can compare. What matters most to you: longevity, scent profile, or price?",
      revealProducts: ["2"],
      insight: {
        type: "Praise",
        tag: "Product Interest",
        stage: "Pre-purchase",
        segment: "Browse Abandoner",
        quote: message,
      },
    };
  }
  if (lower.includes("different") || lower.includes("else") || lower.includes("autre") || lower.includes("other")) {
    return {
      reply: "No problem at all! Let's explore something fresh. Here's one of our most intriguing options right now. What draws you to a fragrance — the scent itself, the bottle design, or the brand story?",
      revealProducts: ["3"],
      insight: {
        type: "Suggestion",
        tag: "Product Exploration",
        stage: "Pre-purchase",
        segment: "Browse Abandoner",
        quote: message,
      },
    };
  }
  return {
    reply: "No worries at all! Everyone shops at their own pace. Would you like to revisit the J'adore, or shall we explore something completely different today?",
    insight: {
      type: "Suggestion",
      tag: "General Feedback",
      stage: "Pre-purchase",
      segment: "Browse Abandoner",
      quote: message,
    },
  };
}

// Pre-populated mock insights for demo
const MOCK_INSIGHTS: Insight[] = [
  {
    id: "mock-1",
    type: "Pain point",
    tag: "Delivery/Shipping",
    stage: "Post-purchase",
    segment: "Returning User",
    quote: "My order took almost 3 weeks to arrive, that's really too long for the price I paid.",
    timestamp: new Date(Date.now() - 3600000 * 2),
    suggestedAction: "Alert: 47 mentions of slow shipping this week. Recommend activating express shipping promo for affected zip codes.",
  },
  {
    id: "mock-2",
    type: "Pain point",
    tag: "Pricing",
    stage: "Pre-purchase",
    segment: "Browse Abandoner",
    quote: "I love the Dior perfume but $155 is just too much without being able to test it first.",
    timestamp: new Date(Date.now() - 3600000 * 4),
    suggestedAction: "Recommendation: Launch a 'Try Before You Buy' sample program for fragrances over $100.",
  },
  {
    id: "mock-3",
    type: "Praise",
    tag: "Product Satisfaction",
    stage: "Post-purchase",
    segment: "Returning User",
    quote: "The Génifique serum is incredible, my skin has never looked this good!",
    timestamp: new Date(Date.now() - 3600000 * 5),
  },
  {
    id: "mock-4",
    type: "Pain point",
    tag: "Product Condition",
    stage: "Post-purchase",
    segment: "Returning User",
    quote: "The box was crushed when it arrived and the perfume cap was cracked.",
    timestamp: new Date(Date.now() - 3600000 * 6),
    suggestedAction: "Alert: 12 packaging damage reports this month. Recommend upgrading fragile item packaging standards.",
  },
  {
    id: "mock-5",
    type: "Suggestion",
    tag: "Feature Request",
    stage: "Pre-purchase",
    segment: "New User",
    quote: "It would be great to have a virtual try-on for lipstick shades before buying.",
    timestamp: new Date(Date.now() - 3600000 * 8),
    suggestedAction: "Opportunity: AR try-on feature could reduce return rate by ~25%. Prioritize for next sprint.",
  },
  {
    id: "mock-6",
    type: "Praise",
    tag: "Customer Service",
    stage: "Post-purchase",
    segment: "Returning User",
    quote: "The AI concierge recommended the perfect eye cream for me — felt super personalized!",
    timestamp: new Date(Date.now() - 3600000 * 10),
  },
  {
    id: "mock-7",
    type: "Pain point",
    tag: "Website UX",
    stage: "Pre-purchase",
    segment: "Browse Abandoner",
    quote: "I couldn't find the shade selector easily on mobile, so I just gave up.",
    timestamp: new Date(Date.now() - 3600000 * 12),
    suggestedAction: "UX Alert: Mobile shade selector visibility is a top-3 pain point. Recommend A/B testing a floating shade picker.",
  },
];

// Mock chart data
export const MOCK_CHART_DATA = {
  insightsByType: [
    { name: "Pain Points", value: 34, fill: "hsl(var(--insight-pain))" },
    { name: "Praise", value: 28, fill: "hsl(var(--insight-praise))" },
    { name: "Suggestions", value: 18, fill: "hsl(var(--insight-suggestion))" },
  ],
  insightsOverTime: [
    { day: "Mon", painPoints: 8, praise: 5, suggestions: 3 },
    { day: "Tue", painPoints: 12, praise: 7, suggestions: 4 },
    { day: "Wed", painPoints: 6, praise: 9, suggestions: 5 },
    { day: "Thu", painPoints: 15, praise: 6, suggestions: 2 },
    { day: "Fri", painPoints: 9, praise: 11, suggestions: 6 },
    { day: "Sat", painPoints: 5, praise: 14, suggestions: 3 },
    { day: "Sun", painPoints: 7, praise: 8, suggestions: 4 },
  ],
  topTags: [
    { tag: "Delivery/Shipping", count: 47 },
    { tag: "Pricing", count: 23 },
    { tag: "Product Satisfaction", count: 19 },
    { tag: "Product Condition", count: 12 },
    { tag: "Website UX", count: 9 },
  ],
};

// Context
interface AppState {
  demoState: DemoState;
  setDemoState: (s: DemoState) => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  products: Product[];
  revealedProductIds: string[];
  insights: Insight[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoStateRaw] = useState<DemoState>("returning");
  const [messages, setMessages] = useState<ChatMessage[]>([GREETINGS.returning]);
  const [insights, setInsights] = useState<Insight[]>(MOCK_INSIGHTS);
  const [revealedProductIds, setRevealedProductIds] = useState<string[]>([]);
  const [turnIndex, setTurnIndex] = useState(0);

  const setDemoState = useCallback((s: DemoState) => {
    setDemoStateRaw(s);
    setMessages([GREETINGS[s]]);
    setRevealedProductIds([]);
    setTurnIndex(0);
    // Keep mock insights, only clear live ones would be separate
  }, []);

  const products = ALL_PRODUCTS;

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    const currentTurn = turnIndex;
    setTurnIndex(prev => prev + 1);

    setTimeout(() => {
      const { reply, insight, revealProducts } = getAIResponse(content, demoState, currentTurn);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: reply,
        timestamp: new Date(),
        revealProducts,
      };
      setMessages(prev => [...prev, aiMsg]);

      if (revealProducts) {
        setRevealedProductIds(prev => [...new Set([...prev, ...revealProducts])]);
      }

      if (insight) {
        const newInsight: Insight = {
          ...insight,
          id: `insight-${Date.now()}`,
          quote: content,
          timestamp: new Date(),
        };
        setInsights(prev => [newInsight, ...prev]);
      }
    }, 1200);
  }, [demoState, turnIndex]);

  return (
    <AppContext.Provider value={{ demoState, setDemoState, messages, sendMessage, products, revealedProductIds, insights }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
