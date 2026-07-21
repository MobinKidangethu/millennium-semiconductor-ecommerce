import { Component, ElementRef, inject, signal, viewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChatbotService, ChatMessage } from '../../core/services/chatbot.service';
import { ViewportService } from '../../core/services/viewport.service';
import { inr } from '../../core/utils/price.utils';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (!open()) {
      <button class="cw-bubble" [class.mobile]="vp.isMobile()" (click)="openChat()" aria-label="Open chat">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.9 8.9 0 0 1-2.9-.5L3 21l1.6-4.8A8.4 8.4 0 1 1 21 11.5Z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>
      </button>
    }

    @if (open()) {
      <div class="cw-panel" [class.mobile]="vp.isMobile()">
        <header class="cw-panel__header">
          <div>
            <div class="cw-panel__title">Millennium Digital Assistant</div>
            <div class="cw-panel__subtitle">Usually replies instantly</div>
          </div>
          <button class="cw-panel__close" (click)="open.set(false)" aria-label="Close chat">✕</button>
        </header>

        <div class="cw-panel__messages" #scrollAnchor>
          @for (m of messages(); track m.timestamp) {
            <div class="cw-msg" [class.cw-msg--user]="m.sender === 'user'">
              <div class="cw-msg__bubble" [class.cw-msg__bubble--user]="m.sender === 'user'">
                @for (line of splitLines(m.text); track $index) {
                  <div>{{ line }}</div>
                }
              </div>

              @if (m.products && m.products.length > 0) {
                <div class="cw-products">
                  @for (p of m.products; track p.id) {
                    <a [routerLink]="productLink(p.id)" class="cw-product-card" (click)="open.set(false)">
                      <img [src]="p.image" [alt]="p.title" />
                      <div class="cw-product-info">
                        <div class="cw-product-title">{{ p.title }}</div>
                        <div class="cw-product-meta">{{ p.manufacturer }} · {{ formatPrice(p.price) }}</div>
                      </div>
                    </a>
                  }
                </div>
              }

              @if (m.sender === 'bot' && m.quickReplies && $index === messages().length - 1) {
                <div class="cw-quick-replies">
                  @for (q of m.quickReplies; track q) {
                    <button class="cw-quick-reply" (click)="send(q)">{{ q }}</button>
                  }
                </div>
              }
            </div>
          }
        </div>

        <form class="cw-panel__input-row" (submit)="onSubmit($event)">
          <input [(ngModel)]="draft" name="draft" placeholder="Type a message…" autocomplete="off" />
          <button type="submit" aria-label="Send">➤</button>
        </form>
      </div>
    }
  `,
  styles: [`
    .cw-bubble {
      position: fixed; bottom: 24px; right: 20px; width: 58px; height: 58px; border-radius: 50%;
      background: var(--color-primary, #70284e); border: none; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.25); z-index: 80; cursor: pointer;
    }
    .cw-bubble.mobile { bottom: 76px; right: 16px; width: 52px; height: 52px; }

    .cw-panel {
      position: fixed; bottom: 24px; right: 20px; width: 360px; max-width: calc(100vw - 40px);
      height: 520px; max-height: calc(100vh - 100px); background: #fff; border-radius: 14px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.25); z-index: 80; display: flex; flex-direction: column; overflow: hidden;
    }
    .cw-panel.mobile { bottom: 0; right: 0; left: 0; width: 100%; max-width: 100%; height: 78vh; max-height: 78vh; border-radius: 16px 16px 0 0; }

    .cw-panel__header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--color-primary, #70284e); color: #fff; }
    .cw-panel__title { font-weight: 800; font-size: 14.5px; }
    .cw-panel__subtitle { font-size: 11.5px; opacity: 0.85; margin-top: 2px; }
    .cw-panel__close { background: none; border: none; color: #fff; font-size: 16px; padding: 4px; }

    .cw-panel__messages { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 12px; background: #f7f7f9; }
    .cw-msg { display: flex; flex-direction: column; align-items: flex-start; }
    .cw-msg--user { align-items: flex-end; }
    .cw-msg__bubble { background: #fff; border: 1px solid #eee; border-radius: 12px 12px 12px 2px; padding: 10px 13px; font-size: 13.5px; color: #1a1a2e; line-height: 1.4; max-width: 85%; white-space: pre-wrap; }
    .cw-msg__bubble--user { background: var(--color-primary, #70284e); color: #fff; border: none; border-radius: 12px 12px 2px 12px; }

    .cw-quick-replies { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .cw-quick-reply { background: #fff; border: 1px solid var(--color-primary, #70284e); color: var(--color-primary, #70284e); border-radius: 999px; padding: 7px 13px; font-size: 12.5px; font-weight: 600; }

    .cw-products { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; width: 100%; max-width: 85%; }
    .cw-product-card { display: flex; gap: 10px; background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 8px; text-decoration: none; color: inherit; }
    .cw-product-card img { width: 40px; height: 40px; object-fit: contain; flex-shrink: 0; }
    .cw-product-title { font-size: 12.5px; font-weight: 700; color: #1a1a2e; line-height: 1.3; }
    .cw-product-meta { font-size: 11px; color: #888; margin-top: 2px; }

    .cw-panel__input-row { display: flex; align-items: center; gap: 8px; padding: 10px; border-top: 1px solid #eee; background: #fff; }
    .cw-panel__input-row input { flex: 1; border: 1px solid #ddd; border-radius: 999px; padding: 10px 16px; font-size: 13.5px; outline: none; }
    .cw-panel__input-row button { background: var(--color-primary, #70284e); color: #fff; border: none; width: 38px; height: 38px; border-radius: 50%; font-size: 15px; flex-shrink: 0; }
  `]
})
export class ChatWidget implements AfterViewChecked {
  private chatbot = inject(ChatbotService);
  vp = inject(ViewportService);
  scrollAnchor = viewChild<ElementRef<HTMLDivElement>>('scrollAnchor');

  open = signal(false);
  messages = signal<ChatMessage[]>([]);
  draft = '';
  private shouldScroll = false;

  openChat() {
    this.open.set(true);
    if (this.messages().length === 0) {
      this.messages.set([this.chatbot.welcomeMessage()]);
      this.shouldScroll = true;
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.send(this.draft);
    this.draft = '';
  }

  send(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text, timestamp: Date.now() };
    this.messages.update(list => [...list, userMsg]);
    this.shouldScroll = true;

    setTimeout(() => {
      const reply = this.chatbot.respond(text);
      this.messages.update(list => [...list, reply]);
      this.shouldScroll = true;
    }, 350);
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      const el = this.scrollAnchor()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  splitLines(text: string): string[] {
    return text.split('\n');
  }

  productLink(id: number): string[] {
    return this.vp.isMobile() ? ['/m/product', String(id)] : ['/product', String(id)];
  }

  formatPrice(p: number): string {
    return inr(p);
  }
}
