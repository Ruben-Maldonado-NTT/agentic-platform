import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent {
  messages: { role: 'user' | 'agent', text: string }[] = [];
  input = '';

  sendMessage() {
    if (!this.input.trim()) return;

    this.messages.push({ role: 'user', text: this.input });

    const inputText = this.input;
    this.input = '';

    // Simulación de respuesta mock
    setTimeout(() => {
      this.messages.push({
        role: 'agent',
        text: `Respuesta simulada del agente a: "${inputText}"`
      });
    }, 800);
  }
}
