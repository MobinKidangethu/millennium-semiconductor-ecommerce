import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWidget } from './shared/chatbot/chat-widget';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatWidget
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}