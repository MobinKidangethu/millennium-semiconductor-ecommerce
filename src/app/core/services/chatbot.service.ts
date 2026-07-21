import { Injectable, inject } from '@angular/core';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { CheckoutService } from './checkout.service';
import { Product } from '../models/product.model';
import { inr } from '../utils/price.utils';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  quickReplies?: string[];
  products?: Product[];
  timestamp: number;
}

const GREETING_WORDS = ['hi', 'hello', 'hey', 'hola', 'good morning', 'good afternoon', 'good evening'];
const ORDER_NUMBER_PATTERN = /\b([A-Z]{2,4}-\d{4,}(?:-\d+)?)\b/i;

const MAIN_QUICK_REPLIES = ['Find a product', 'Track my order', 'Shipping info', 'Payment methods', 'Return policy', 'Talk to support'];

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private auth = inject(AuthService);
  private checkout = inject(CheckoutService);

  welcomeMessage(): ChatMessage {
    const name = this.auth.currentUser()?.name?.split(' ')[0];
    return {
      sender: 'bot',
      text: name
        ? `Hi ${name}! I'm the Millennium Digital assistant. I can help you find parts, track orders, or answer questions about shipping and payments.`
        : `Hi! I'm the Millennium Digital assistant. I can help you find parts, track orders, or answer questions about shipping and payments.`,
      quickReplies: MAIN_QUICK_REPLIES,
      timestamp: Date.now()
    };
  }

  respond(rawText: string): ChatMessage {
    const text = rawText.trim();
    const lower = text.toLowerCase();

    if (GREETING_WORDS.some(w => lower === w || lower.startsWith(w + ' ') || lower.startsWith(w + '!'))) {
      return this.welcomeMessage();
    }

    if (/\btrack\b|\bmy order\b|\border status\b/.test(lower) || ORDER_NUMBER_PATTERN.test(text)) {
      return this.handleOrderQuery(text);
    }

    if (/\bmy orders\b|\border history\b/.test(lower)) {
      return this.handleOrderHistory();
    }

    if (/\bcart\b/.test(lower)) {
      return this.handleCartQuery();
    }

    if (/\bship|\bdeliver|\bfreight/.test(lower)) {
      return this.handleShippingQuery();
    }

    if (/\bpay|\bpayment|\bupi\b|\bwire\b|\bnet ?30\b|\bpurchase order\b|\bpo\b/.test(lower)) {
      return this.handlePaymentQuery();
    }

    if (/\breturn|\brefund|\bexchange|\brma\b/.test(lower)) {
      return this.handleReturnQuery();
    }

    if (/\bsupport\b|\bhuman\b|\bagent\b|\bcontact\b|\bhelp\b(?!.*find)/.test(lower)) {
      return this.handleSupportQuery();
    }

    if (/\bfind\b|\bsearch\b|\blooking for\b|\bneed\b|\bpart\b|\bcomponent\b/.test(lower)) {
      return this.handleProductSearch(text);
    }

    // Try a product search anyway — if it turns up good matches, show them;
    // otherwise fall back to the generic help message.
    const guessResults = this.searchProducts(text);
    if (guessResults.length > 0) {
      return this.buildProductResponse(text, guessResults);
    }

    return {
      sender: 'bot',
      text: `I didn't quite catch that. Here's what I can help with:`,
      quickReplies: MAIN_QUICK_REPLIES,
      timestamp: Date.now()
    };
  }

  private searchProducts(query: string): Product[] {
    const stopWords = ['find', 'search', 'looking', 'for', 'a', 'need', 'i', 'want', 'do', 'you', 'have', 'any', 'me', 'part', 'component', 'the'];
    const cleaned = query
      .toLowerCase()
      .split(/\s+/)
      .filter(w => !stopWords.includes(w))
      .join(' ')
      .trim();
    if (!cleaned) return [];
    let results: Product[] = [];
    this.productService.search(cleaned).subscribe(r => (results = r));
    return results.slice(0, 3);
  }

  private buildProductResponse(query: string, results: Product[]): ChatMessage {
    if (results.length === 0) {
      return {
        sender: 'bot',
        text: `I couldn't find anything matching "${query}". Try a manufacturer name, part number, or category like "diodes" or "microcontrollers".`,
        quickReplies: ['Browse categories', 'Talk to support'],
        timestamp: Date.now()
      };
    }
    return {
      sender: 'bot',
      text: `Here's what I found for "${query}":`,
      products: results,
      quickReplies: ['See more results', 'Talk to support'],
      timestamp: Date.now()
    };
  }

  private handleProductSearch(text: string): ChatMessage {
    const results = this.searchProducts(text);
    return this.buildProductResponse(text, results);
  }

  private handleOrderQuery(text: string): ChatMessage {
    const match = text.match(ORDER_NUMBER_PATTERN);
    if (!match) {
      return {
        sender: 'bot',
        text: `Sure — what's your order number? It looks like MD-847291 or ORD-2025-78341.`,
        timestamp: Date.now()
      };
    }
    const order = this.orderService.getOrder(match[1].toUpperCase());
    if (!order) {
      return {
        sender: 'bot',
        text: `I couldn't find an order matching "${match[1]}". Double-check the number, or I can connect you with support.`,
        quickReplies: ['Talk to support'],
        timestamp: Date.now()
      };
    }
    const itemCount = order.items.reduce((sum, i) => sum + i.qty, 0);
    return {
      sender: 'bot',
      text: `Order #${order.orderNumber} — status: **${order.status}**. ${itemCount} item(s), total ${inr(order.total)}, placed on ${new Date(order.placedAt).toLocaleDateString()}.`,
      quickReplies: ['Track my order', 'Talk to support'],
      timestamp: Date.now()
    };
  }

  private handleOrderHistory(): ChatMessage {
    const email = this.auth.currentUser()?.email;
    if (!email) {
      return {
        sender: 'bot',
        text: `You'll need to sign in first so I can pull up your order history.`,
        quickReplies: ['Talk to support'],
        timestamp: Date.now()
      };
    }
    const orders = this.orderService.getOrdersForUser(email);
    if (orders.length === 0) {
      return { sender: 'bot', text: `You don't have any orders yet.`, timestamp: Date.now() };
    }
    const lines = orders.slice(0, 3).map(o => `• #${o.orderNumber} — ${o.status} — ${inr(o.total)}`).join('\n');
    return {
      sender: 'bot',
      text: `Here are your most recent orders:\n${lines}`,
      quickReplies: ['Talk to support'],
      timestamp: Date.now()
    };
  }

  private handleCartQuery(): ChatMessage {
    const count = this.cartService.itemCount();
    if (count === 0) {
      return { sender: 'bot', text: `Your cart is empty right now.`, quickReplies: ['Find a product'], timestamp: Date.now() };
    }
    return {
      sender: 'bot',
      text: `You have ${count} item(s) in your cart, totaling ${inr(this.cartService.total())}.`,
      timestamp: Date.now()
    };
  }

  private handleShippingQuery(): ChatMessage {
    const lines = this.checkout.shippingMethods
      .map(m => `• ${m.label} — ${m.price === 0 ? 'FREE' : inr(m.price)}`)
      .join('\n');
    return {
      sender: 'bot',
      text: `We offer these shipping options:\n${lines}\n\nYou'll pick one at checkout.`,
      quickReplies: MAIN_QUICK_REPLIES,
      timestamp: Date.now()
    };
  }

  private handlePaymentQuery(): ChatMessage {
    return {
      sender: 'bot',
      text: `We accept:\n• Credit / Debit Card\n• UPI (for orders up to ₹1,00,000)\n• Wire Transfer\n• Net 30 (approved business accounts)\n• Purchase Order\n\nYou can choose any of these during checkout.`,
      quickReplies: MAIN_QUICK_REPLIES,
      timestamp: Date.now()
    };
  }

  private handleReturnQuery(): ChatMessage {
    return {
      sender: 'bot',
      text: `Unused parts in original packaging can be returned within 30 days of delivery. Custom or cut-tape orders are final sale. For a return authorization, share your order number with our support team.`,
      quickReplies: ['Talk to support'],
      timestamp: Date.now()
    };
  }

  private handleSupportQuery(): ChatMessage {
    return {
      sender: 'bot',
      text: `You can reach our support team at support@millenniumdigital.com or call +91 80 4567 8900 (Mon–Fri, 9am–6pm IST). Want me to help with something specific in the meantime?`,
      quickReplies: MAIN_QUICK_REPLIES,
      timestamp: Date.now()
    };
  }
}
