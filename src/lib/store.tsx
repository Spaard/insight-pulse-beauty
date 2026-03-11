import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types
export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
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

export type DemoState = "new" | "returning";

// Mock Data
const NEW_USER_PRODUCTS: Product[] = [
  { id: "1", name: "Gloss Bomb Universal Lip Luminizer", brand: "Fenty Beauty", price: "$22", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300&h=300&fit=crop", tag: "Best Seller" },
  { id: "2", name: "J'adore Eau de Parfum", brand: "Dior", price: "$155", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop", tag: "Trending" },
  { id: "3", name: "Black Opium Eau de Parfum", brand: "YSL", price: "$142", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=300&h=300&fit=crop" },
  { id: "4", name: "Soft Matte Complete Foundation", brand: "NARS", price: "$42", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", tag: "Editor's Pick" },
];

const RETURNING_USER_PRODUCTS: Product[] = [
  { id: "5", name: "Advanced Génifique Eye Cream", brand: "Lancôme", price: "$68", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=300&h=300&fit=crop", tag: "Complement" },
  { id: "6", name: "Hydra Beauty Micro Sérum", brand: "Chanel", price: "$120", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&h=300&fit=crop", tag: "Recommended" },
  { id: "7", name: "Vitamin C Serum", brand: "La Roche-Posay", price: "$45", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop" },
  { id: "8", name: "SPF 50 UV Protect", brand: "Supergoop!", price: "$36", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop", tag: "Essential" },
];

const NEW_USER_GREETING: ChatMessage = {
  id: "init-new",
  role: "ai",
  content: "Welcome to Sephora! ✨ I'm your AI Personal Shopper. Are you looking for skincare, makeup, or fragrance today?",
  timestamp: new Date(),
};

const RETURNING_USER_GREETING: ChatMessage = {
  id: "init-returning",
  role: "ai",
  content: "Welcome back, Sarah! 💫 I see you ordered the **Lancôme Advanced Génifique Serum** last month. Before we look at new items, I'd love to know: how is that serum working for you?",
  timestamp: new Date(),
};

// AI mock responses
const AI_RESPONSES: Record<string, { reply: string; insight?: Omit<Insight, "id" | "timestamp"> }> = {
  shipping: {
    reply: "I completely understand your frustration, Sarah. Two weeks is definitely too long — you deserve better. I've flagged this with our logistics team. As a thank-you for your patience, I'd like to offer you complimentary express shipping on your next order. Now, would you like to explore some products that pair beautifully with your Génifique Serum?",
    insight: {
      type: "Pain point",
      tag: "Delivery/Shipping",
      stage: "Post-purchase",
      segment: "Returning User",
      quote: "",
      suggestedAction: "Alert: 15 mentions of slow shipping today. Recommend sending a 15% apology discount code to affected users.",
    },
  },
  great: {
    reply: "That's wonderful to hear! 🎉 The Génifique Serum is truly a powerhouse. Since your skin is loving it, I think you'd absolutely adore the **Advanced Génifique Eye Cream** — it uses the same microbiome science for the delicate eye area. Shall I add a sample to your next order?",
    insight: {
      type: "Praise",
      tag: "Product Satisfaction",
      stage: "Post-purchase",
      segment: "Returning User",
      quote: "",
    },
  },
  default: {
    reply: "Thank you for sharing that! I've noted your feedback. Based on what you've told me, I have some personalized recommendations that I think you'll love. Would you like me to walk you through them?",
    insight: {
      type: "Suggestion",
      tag: "General Feedback",
      stage: "Post-purchase",
      segment: "Returning User",
      quote: "",
    },
  },
};

function getAIResponse(message: string): { reply: string; insight?: Omit<Insight, "id" | "timestamp"> } {
  const lower = message.toLowerCase();
  if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("slow") || lower.includes("week")) {
    return AI_RESPONSES.shipping;
  }
  if (lower.includes("great") || lower.includes("love") || lower.includes("amazing") || lower.includes("good")) {
    return AI_RESPONSES.great;
  }
  return AI_RESPONSES.default;
}

// Context
interface AppState {
  demoState: DemoState;
  setDemoState: (s: DemoState) => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  products: Product[];
  insights: Insight[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoStateRaw] = useState<DemoState>("returning");
  const [messages, setMessages] = useState<ChatMessage[]>([RETURNING_USER_GREETING]);
  const [insights, setInsights] = useState<Insight[]>([]);

  const setDemoState = useCallback((s: DemoState) => {
    setDemoStateRaw(s);
    setMessages([s === "new" ? NEW_USER_GREETING : RETURNING_USER_GREETING]);
    setInsights([]);
  }, []);

  const products = demoState === "new" ? NEW_USER_PRODUCTS : RETURNING_USER_PRODUCTS;

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate AI thinking delay
    setTimeout(() => {
      const { reply, insight } = getAIResponse(content);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);

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
  }, []);

  return (
    <AppContext.Provider value={{ demoState, setDemoState, messages, sendMessage, products, insights }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
