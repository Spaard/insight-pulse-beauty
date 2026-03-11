import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types
export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  revealProducts?: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  tag?: string;
  keywords: string[];
}

export type InsightType = "Pain point" | "Praise" | "Suggestion";

export interface InsightMessage {
  id: string;
  quote: string;
  segment: string;
  stage: string;
  timestamp: Date;
}

export interface InsightCategory {
  id: string;
  type: InsightType;
  tag: string;
  messages: InsightMessage[];
  suggestedAction: string;
  severity: "low" | "medium" | "high" | "critical";
  createdAt: Date;
  updatedAt: Date;
}

export type DemoState = "new" | "returning" | "abandoned";

// Mock Data
const ALL_PRODUCTS: Product[] = [
  { id: "1", name: "Gloss Bomb Universal Lip Luminizer", brand: "Fenty Beauty", price: "$22", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300&h=300&fit=crop", tag: "Best Seller", keywords: ["gloss", "lip", "lèvres", "brillant"] },
  { id: "2", name: "J'adore Eau de Parfum", brand: "Dior", price: "$155", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop", tag: "Trending", keywords: ["perfume", "parfum", "fragrance", "scent", "dior", "j'adore"] },
  { id: "3", name: "Black Opium Eau de Parfum", brand: "YSL", price: "$142", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=300&h=300&fit=crop", keywords: ["perfume", "parfum", "fragrance", "scent", "ysl", "opium"] },
  { id: "4", name: "Soft Matte Complete Foundation", brand: "NARS", price: "$42", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", tag: "Editor's Pick", keywords: ["foundation", "fond de teint", "base", "teint", "matte", "nars"] },
  { id: "5", name: "Advanced Génifique Eye Cream", brand: "Lancôme", price: "$68", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=300&h=300&fit=crop", tag: "Complement", keywords: ["eye", "yeux", "cream", "crème", "contour", "cernes", "lancôme"] },
  { id: "6", name: "Hydra Beauty Micro Sérum", brand: "Chanel", price: "$120", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&h=300&fit=crop", tag: "Recommended", keywords: ["serum", "sérum", "hydra", "hydratant", "moisturizer", "chanel", "skincare", "skin"] },
  { id: "7", name: "Vitamin C Serum", brand: "La Roche-Posay", price: "$45", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop", keywords: ["serum", "sérum", "vitamin", "vitamine", "bright", "éclat", "skincare", "skin"] },
  { id: "8", name: "SPF 50 UV Protect", brand: "Supergoop!", price: "$36", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop", tag: "Essential", keywords: ["spf", "sunscreen", "solaire", "protection", "uv", "sun"] },
  { id: "9", name: "Precision Lip Liner", brand: "MAC", price: "$23", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop", tag: "Classic", keywords: ["liner", "lip liner", "crayon", "lèvres", "contour lèvres", "lip pencil"] },
  { id: "10", name: "24H Waterproof Eyeliner", brand: "Kat Von D", price: "$24", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop", tag: "Best Seller", keywords: ["eyeliner", "eye liner", "liner yeux", "khol", "kohl", "trait", "waterproof"] },
  { id: "11", name: "Rouge Dior Satin Lipstick", brand: "Dior", price: "$45", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=300&fit=crop", tag: "Iconic", keywords: ["lipstick", "rouge à lèvres", "rouge", "red", "satin", "dior"] },
  { id: "12", name: "Volumizing Mascara Le 8", brand: "Chanel", price: "$38", image: "https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=300&h=300&fit=crop", tag: "New", keywords: ["mascara", "cils", "lashes", "volume", "eyes", "chanel"] },
  { id: "13", name: "5-Color Eyeshadow Palette", brand: "Dior", price: "$65", image: "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=300&h=300&fit=crop", keywords: ["eyeshadow", "ombre", "palette", "fard", "paupières", "shadow"] },
  { id: "14", name: "Touche Éclat Highlighter Pen", brand: "YSL", price: "$42", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", tag: "Iconic", keywords: ["highlighter", "illuminateur", "highlight", "éclat", "concealer", "anticerne", "touche éclat"] },
  { id: "15", name: "Setting Powder Airbrush", brand: "Charlotte Tilbury", price: "$49", image: "https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=300&h=300&fit=crop", keywords: ["powder", "poudre", "setting", "fixante", "matifier", "blurring"] },
  { id: "16", name: "Orgasm Blush", brand: "NARS", price: "$38", image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300&h=300&fit=crop", tag: "Cult Favorite", keywords: ["blush", "joues", "cheeks", "rose", "nars", "orgasm"] },
];

const GREETINGS: Record<DemoState, ChatMessage> = {
  new: {
    id: "init-new",
    role: "ai",
    content: "Welcome to Luxora! ✨ I'm your AI Personal Shopper. Are you looking for skincare, makeup, or fragrance today?",
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

// AI classification: maps keywords to existing categories or creates new ones
interface ClassificationResult {
  type: InsightType;
  tag: string;
  stage: string;
  segment: string;
  suggestedAction: string;
  severity: "low" | "medium" | "high" | "critical";
}

function classifyFeedback(message: string, demoState: DemoState): ClassificationResult | null {
  const lower = message.toLowerCase();

  const segment = demoState === "new" ? "New User" : demoState === "returning" ? "Returning User" : "Browse Abandoner";
  const stage = demoState === "new" ? "Discovery" : demoState === "returning" ? "Post-purchase" : "Pre-purchase";

  // Pain points
  if (lower.match(/shipping|delivery|slow|livraison|délai|week|semaine|long/)) {
    return { type: "Pain point", tag: "Delivery/Shipping", stage, segment, severity: "high", suggestedAction: "Activate express shipping promo for affected zip codes. Send 15% apology discount to users who experienced delays >7 days. Escalate to logistics partner for SLA review." };
  }
  if (lower.match(/damaged|broken|abîmé|cassé|packaging|crushed|cracked|écrasé/)) {
    return { type: "Pain point", tag: "Product Condition", stage, segment, severity: "critical", suggestedAction: "Immediately send replacement with express shipping. Audit warehouse packaging standards for fragile items. Implement double-box packaging for products >$50." };
  }
  if (lower.match(/price|expensive|cher|budget|prix|coût|cost|afford/)) {
    return { type: "Pain point", tag: "Pricing", stage, segment, severity: "medium", suggestedAction: "Launch 'First Purchase' 10% discount campaign for browse abandoners. Consider sample-size pricing tier. A/B test installment payment option (Klarna/Afterpay)." };
  }
  if (lower.match(/site|mobile|app|bug|crash|lent|slow.*load|ux|interface|navigate|trouver|find/)) {
    return { type: "Pain point", tag: "Website UX", stage, segment, severity: "medium", suggestedAction: "Run mobile UX audit. A/B test floating shade picker and simplified navigation. Prioritize page load optimization for product pages." };
  }
  if (lower.match(/return|refund|remboursement|retour|exchange|échange/)) {
    return { type: "Pain point", tag: "Returns & Refunds", stage, segment, severity: "high", suggestedAction: "Simplify return flow to 2 clicks. Add prepaid return labels in all orders. Consider extending return window from 30 to 60 days." };
  }

  // Praise
  if (lower.match(/great|love|amazing|good|super|bien|adore|excellent|perfect|parfait|incredible|fantastic|best/)) {
    return { type: "Praise", tag: "Product Satisfaction", stage, segment, severity: "low", suggestedAction: "Invite user to leave a review. Feature quote in social proof carousel. Consider loyalty program enrollment offer." };
  }
  if (lower.match(/helpful|service|support|concierge|recommend|personalized|personnalisé/)) {
    return { type: "Praise", tag: "Customer Service", stage, segment, severity: "low", suggestedAction: "Share positive feedback with CS team. Use as training example. Consider case study for AI concierge marketing." };
  }

  // Suggestions
  if (lower.match(/wish|want|would be|should|could|suggest|feature|try-on|virtual|essayer|fonctionnalité/)) {
    return { type: "Suggestion", tag: "Feature Request", stage, segment, severity: "medium", suggestedAction: "Add to product backlog. Validate with user research survey (target N=200). Estimate ROI and prioritize in next sprint planning." };
  }
  if (lower.match(/shade|color|couleur|teinte|match|skin.*tone/)) {
    return { type: "Suggestion", tag: "Shade Matching", stage, segment, severity: "medium", suggestedAction: "Prioritize AR shade-matching tool development. Partner with ModiFace/Perfect Corp for quick MVP. Expected to reduce shade-related returns by 30%." };
  }

  // Generic classification for unmatched messages with enough substance
  if (message.length > 15) {
    return { type: "Suggestion", tag: "General Feedback", stage, segment, severity: "low", suggestedAction: "Review and categorize manually. Flag for product team weekly digest." };
  }

  return null;
}

// Smart product matching: find the best product for a user query
function findMatchingProducts(query: string, alreadyRevealed: string[], count: number = 1): string[] {
  const lower = query.toLowerCase();
  const words = lower.split(/\s+/);
  
  // Score each product by keyword match relevance
  const scored = ALL_PRODUCTS
    .filter(p => !alreadyRevealed.includes(p.id))
    .map(p => {
      let score = 0;
      for (const kw of p.keywords) {
        // Exact word match in query
        if (words.includes(kw)) score += 10;
        // Partial match (query contains keyword)
        else if (lower.includes(kw)) score += 7;
        // Keyword contains a query word (e.g. "liner" matches "lip liner")
        else if (words.some(w => w.length > 2 && kw.includes(w))) score += 5;
      }
      // Also match product name
      const nameLower = p.name.toLowerCase();
      for (const w of words) {
        if (w.length > 2 && nameLower.includes(w)) score += 6;
      }
      // Match brand
      if (lower.includes(p.brand.toLowerCase())) score += 8;
      return { product: p, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map(s => s.product.id);
}

// Conversational AI responses per state
function getAIResponse(message: string, demoState: DemoState, turnIndex: number, revealedProductIds: string[]): { reply: string; revealProducts?: string[] } {
  const lower = message.toLowerCase();

  if (demoState === "new") {
    if (lower.includes("skincare") || lower.includes("skin")) {
      return { reply: "Great choice! Skincare is all about finding what works for your unique skin. I'd recommend starting with this — it's one of our most-loved serums right now.\n\nQuick question before we go further: **how important is ingredient transparency to you when choosing skincare?** (Very important / Somewhat / I just want results)", revealProducts: ["7"] };
    }
    if (lower.includes("makeup") || lower.includes("foundation") || lower.includes("lipstick")) {
      return { reply: "Love it! Let me start with something universally flattering — this Fenty Gloss is a fan favorite.\n\n**What's the occasion?** Everyday look, night out, or special event? And out of curiosity — **do you usually shop for beauty online or in-store?**", revealProducts: ["1"] };
    }
    if (lower.includes("fragrance") || lower.includes("perfume") || lower.includes("parfum")) {
      return { reply: "Fragrance is so personal — I love helping with that. Here's a timeless option to start.\n\nDo you tend to prefer fresh & light, or warm & intense scents? Also — **would you be interested in a sample/discovery set before committing to a full bottle?**", revealProducts: ["2"] };
    }
    if (lower.match(/important|très|very|results|résultat|just want/)) {
      return { reply: "Got it, that's super helpful! Here's another option that's all about visible results — clinical-grade but still luxurious.\n\n**One more thing: does delivery speed matter a lot to you, or are you okay waiting a few extra days if it means free shipping?**", revealProducts: ["6"] };
    }
    if (lower.match(/online|en ligne|internet/)) {
      return { reply: "Interesting! Since you shop online, **what would make you more confident buying beauty products without testing them first?** Virtual try-on, detailed swatches, reviews, or generous return policies? Here's another pick for you 💄", revealProducts: ["4"] };
    }
    if (lower.match(/store|magasin|boutique|in-store/)) {
      return { reply: "Makes sense — nothing beats trying in person! **What would convince you to buy more online?** Better product videos, AR try-on, or maybe free samples with every order? In the meantime, check this out:", revealProducts: ["4"] };
    }
    if (lower.match(/sample|échantillon|discovery|découverte/)) {
      return { reply: "Love that idea! We're actually exploring discovery sets. **How much would you be willing to pay for a curated sample box of 5 products?** Under $20, $20-40, or $40+? Here's something else you might like:", revealProducts: ["8"] };
    }
    if (turnIndex >= 2) {
      return { reply: "Based on what you've shared, I think you'd also love this. **Last question — would you like to receive personalized product recommendations by email, or do you prefer to discover on your own?**", revealProducts: ["4"] };
    }
    return { reply: "I'd love to help! Are you leaning towards skincare, makeup, or fragrance? Or I can suggest something based on what's trending right now 🔥" };
  }

  if (demoState === "returning") {
    if (lower.match(/shipping|delivery|slow|week|livraison|délai|long/)) {
      return { reply: "I'm really sorry to hear that, Sarah. Two weeks is way too long — you deserve better. I've flagged this with our logistics team.\n\n**Quick question: would you pay a small premium ($5-8) for guaranteed 2-day delivery, or is free shipping more important even if it takes longer?**\n\nIn the meantime, I think your skin would love this eye cream as a complement to your serum 💫", revealProducts: ["5"] };
    }
    if (lower.match(/great|love|amazing|good|super|bien|adore/)) {
      return { reply: "That's wonderful to hear! 🎉 Since your skin is responding so well, I think you'd absolutely adore this — it uses the same microbiome science for the delicate eye area.\n\n**Would you be interested in a subscription/auto-replenish option so you never run out of your favorites?** We're thinking about offering 10% off for subscribers.", revealProducts: ["5"] };
    }
    if (lower.match(/damaged|broken|abîmé|cassé|packaging|crushed|cracked/)) {
      return { reply: "Oh no, I'm so sorry about that! Product arriving damaged is unacceptable. I'm immediately processing a free replacement for you.\n\n**How important is eco-friendly packaging to you vs. maximum protection?** We're exploring sustainable options but want to make sure products arrive safely. Your input really helps! 💛", revealProducts: ["6"] };
    }
    if (lower.match(/subscription|abonnement|auto|yes|oui|sure|ok/)) {
      return { reply: "Great feedback! We'll definitely factor that in. **One more thing — when you repurchase, do you like to stick with what works, or do you enjoy discovering new products each time?**\n\nHere's something new that pairs beautifully with your serum:", revealProducts: ["8"] };
    }
    if (lower.match(/pay|premium|fast|rapide|2.day|express/)) {
      return { reply: "That's really useful to know! **Would you also value real-time delivery tracking with updates, or is just knowing the estimated date enough?**\n\nBy the way, here's a product I think would complement your routine perfectly:", revealProducts: ["6"] };
    }
    if (lower.match(/eco|green|sustainable|durable|environnement|planet/)) {
      return { reply: "Love that you care about sustainability! 🌱 **Would you choose a brand specifically because of eco-friendly packaging, even if it costs slightly more?**\n\nHere's a brand that's doing great things on that front:", revealProducts: ["7"] };
    }
    return { reply: "Thank you for sharing, Sarah! Your feedback is incredibly valuable.\n\n**Before I make a recommendation — on a scale of 1-5, how satisfied are you overall with your Luxora experience so far?** And is there anything we could do better?\n\nIn the meantime, shall I show you something new?", revealProducts: turnIndex >= 2 ? ["6"] : undefined };
  }

  // abandoned
  if (lower.match(/price|expensive|cher|budget|prix|coût|cost/)) {
    return { reply: "Totally understandable! $155 is a commitment. Here's a beautiful alternative at a more comfortable price point.\n\n**Would any of these make you more comfortable purchasing:** installment payments (pay in 3x), a money-back guarantee, or a smaller size at a lower price?", revealProducts: ["3"] };
  }
  if (lower.match(/installment|3x|paiement|payment|pay later/)) {
    return { reply: "Good to know! We're considering adding payment plans. **What's your ideal price range for a signature fragrance?** Under $80, $80-120, or you're flexible if you love it?\n\nHere's another option that might hit the sweet spot:", revealProducts: ["8"] };
  }
  if (lower.match(/not sure|hésit|hesitat|thinking|réfléch|compare|comparer/)) {
    return { reply: "No rush at all! **What would help you decide faster: more detailed reviews from people like you, a side-by-side comparison tool, or the ability to get a sample first?**\n\nHere's an option worth comparing:", revealProducts: ["3"] };
  }
  if (lower.match(/yes|oui|sure|ok|same|continue|reprendre/)) {
    return { reply: "Perfect! Here's the J'adore again — still as gorgeous as ever. If you'd like, I can also show you a few similar options so you can compare.\n\n**What matters most to you in a fragrance: longevity (lasts all day), scent profile (notes & mood), or value for money?**", revealProducts: ["2"] };
  }
  if (lower.match(/different|else|autre|other|new|nouveau/)) {
    return { reply: "No problem at all! Let's explore something fresh. Here's one of our most intriguing options right now.\n\n**What draws you to a fragrance — the scent itself, the bottle design, or the brand story?** This helps me find your perfect match 🎯", revealProducts: ["3"] };
  }
  if (lower.match(/longevity|longev|tenue|lasts|dure/)) {
    return { reply: "A fragrance that lasts — you have great taste! **Do you prefer to apply once in the morning and forget about it, or do you enjoy refreshing throughout the day?**\n\nThis one has incredible staying power:", revealProducts: ["3"] };
  }
  return { reply: "No worries at all! Everyone shops at their own pace. **Before we continue — was there something specific that held you back last time?** Price, not sure about the scent, wanted to compare, or something else? Understanding this helps me find exactly what you need 😊" };
}

// Pre-populated mock insight categories for demo
const MOCK_CATEGORIES: InsightCategory[] = [
  {
    id: "cat-1",
    type: "Pain point",
    tag: "Delivery/Shipping",
    severity: "high",
    suggestedAction: "Activate express shipping promo for affected zip codes. Send 15% apology discount to users who experienced delays >7 days. Escalate to logistics partner for SLA review.",
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 2),
    messages: [
      { id: "m1", quote: "My order took almost 3 weeks to arrive, that's really too long for the price I paid.", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 2) },
      { id: "m2", quote: "Delivery was supposed to take 5 days but it took 12. Very disappointed.", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 8) },
      { id: "m3", quote: "I paid for express shipping and it still came late.", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 15) },
    ],
  },
  {
    id: "cat-2",
    type: "Pain point",
    tag: "Pricing",
    severity: "medium",
    suggestedAction: "Launch 'First Purchase' 10% discount campaign for browse abandoners. Consider sample-size pricing tier. A/B test installment payment option (Klarna/Afterpay).",
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 4),
    messages: [
      { id: "m4", quote: "I love the Dior perfume but $155 is just too much without being able to test it first.", segment: "Browse Abandoner", stage: "Pre-purchase", timestamp: new Date(Date.now() - 3600000 * 4) },
      { id: "m5", quote: "Too expensive for what it is. I found similar quality for half the price elsewhere.", segment: "Browse Abandoner", stage: "Pre-purchase", timestamp: new Date(Date.now() - 3600000 * 20) },
    ],
  },
  {
    id: "cat-3",
    type: "Praise",
    tag: "Product Satisfaction",
    severity: "low",
    suggestedAction: "Invite users to leave reviews. Feature top quotes in social proof carousel. Offer loyalty program enrollment.",
    createdAt: new Date(Date.now() - 3600000 * 72),
    updatedAt: new Date(Date.now() - 3600000 * 5),
    messages: [
      { id: "m6", quote: "The Génifique serum is incredible, my skin has never looked this good!", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 5) },
      { id: "m7", quote: "Absolutely love the texture and results. Will definitely repurchase.", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 18) },
      { id: "m8", quote: "Best serum I've ever used. My friends all want to know my secret!", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 30) },
      { id: "m9", quote: "The glow is real. Worth every penny.", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 42) },
    ],
  },
  {
    id: "cat-4",
    type: "Pain point",
    tag: "Product Condition",
    severity: "critical",
    suggestedAction: "Immediately send replacements with express shipping. Audit warehouse packaging standards for fragile items. Implement double-box packaging for products >$50.",
    createdAt: new Date(Date.now() - 3600000 * 36),
    updatedAt: new Date(Date.now() - 3600000 * 6),
    messages: [
      { id: "m10", quote: "The box was crushed when it arrived and the perfume cap was cracked.", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 6) },
      { id: "m11", quote: "Product leaked inside the packaging. Complete mess.", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 24) },
    ],
  },
  {
    id: "cat-5",
    type: "Suggestion",
    tag: "Feature Request",
    severity: "medium",
    suggestedAction: "Add to product backlog. Validate with user research survey (target N=200). Estimate ROI — AR try-on expected to reduce return rate by ~25%. Prioritize in next sprint planning.",
    createdAt: new Date(Date.now() - 3600000 * 96),
    updatedAt: new Date(Date.now() - 3600000 * 8),
    messages: [
      { id: "m12", quote: "It would be great to have a virtual try-on for lipstick shades before buying.", segment: "New User", stage: "Pre-purchase", timestamp: new Date(Date.now() - 3600000 * 8) },
      { id: "m13", quote: "I wish I could see how a foundation shade looks on my skin tone before ordering.", segment: "New User", stage: "Discovery", timestamp: new Date(Date.now() - 3600000 * 36) },
    ],
  },
  {
    id: "cat-6",
    type: "Praise",
    tag: "Customer Service",
    severity: "low",
    suggestedAction: "Share positive feedback with CS team. Use as training example for AI concierge optimization. Consider case study for marketing.",
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(Date.now() - 3600000 * 10),
    messages: [
      { id: "m14", quote: "The AI concierge recommended the perfect eye cream for me — felt super personalized!", segment: "Returning User", stage: "Post-purchase", timestamp: new Date(Date.now() - 3600000 * 10) },
      { id: "m15", quote: "This is the best shopping assistant I've ever used. So intuitive!", segment: "New User", stage: "Discovery", timestamp: new Date(Date.now() - 3600000 * 28) },
    ],
  },
  {
    id: "cat-7",
    type: "Pain point",
    tag: "Website UX",
    severity: "medium",
    suggestedAction: "Run mobile UX audit. A/B test floating shade picker and simplified navigation. Prioritize page load optimization on product pages.",
    createdAt: new Date(Date.now() - 3600000 * 60),
    updatedAt: new Date(Date.now() - 3600000 * 12),
    messages: [
      { id: "m16", quote: "I couldn't find the shade selector easily on mobile, so I just gave up.", segment: "Browse Abandoner", stage: "Pre-purchase", timestamp: new Date(Date.now() - 3600000 * 12) },
      { id: "m17", quote: "The checkout flow has too many steps. I abandoned my cart twice.", segment: "Browse Abandoner", stage: "Pre-purchase", timestamp: new Date(Date.now() - 3600000 * 40) },
    ],
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
  categories: InsightCategory[];
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoStateRaw] = useState<DemoState>("returning");
  const [messages, setMessages] = useState<ChatMessage[]>([GREETINGS.returning]);
  const [categories, setCategories] = useState<InsightCategory[]>(MOCK_CATEGORIES);
  const [revealedProductIds, setRevealedProductIds] = useState<string[]>([]);
  const [turnIndex, setTurnIndex] = useState(0);

  const setDemoState = useCallback((s: DemoState) => {
    setDemoStateRaw(s);
    setMessages([GREETINGS[s]]);
    setRevealedProductIds([]);
    setTurnIndex(0);
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
      const { reply, revealProducts } = getAIResponse(content, demoState, currentTurn, revealedProductIds);
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

      // Classify and group into categories
      const classification = classifyFeedback(content, demoState);
      if (classification) {
        const newMessage: InsightMessage = {
          id: `msg-${Date.now()}`,
          quote: content,
          segment: classification.segment,
          stage: classification.stage,
          timestamp: new Date(),
        };

        setCategories(prev => {
          const existingIndex = prev.findIndex(c => c.tag === classification.tag && c.type === classification.type);
          if (existingIndex >= 0) {
            // Add message to existing category
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              messages: [newMessage, ...updated[existingIndex].messages],
              updatedAt: new Date(),
              severity: classification.severity === "critical" ? "critical" : updated[existingIndex].severity,
            };
            // Move to top
            const [item] = updated.splice(existingIndex, 1);
            return [item, ...updated];
          } else {
            // Create new category
            const newCat: InsightCategory = {
              id: `cat-${Date.now()}`,
              type: classification.type,
              tag: classification.tag,
              messages: [newMessage],
              suggestedAction: classification.suggestedAction,
              severity: classification.severity,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            return [newCat, ...prev];
          }
        });
      }
    }, 1200);
  }, [demoState, turnIndex]);

  return (
    <AppContext.Provider value={{ demoState, setDemoState, messages, sendMessage, products, revealedProductIds, categories }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
