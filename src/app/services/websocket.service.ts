import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket;

  constructor() {
    this.socket = webSocket('ws://localhost:3000'); // Remplacez par l'URL de votre serveur WebSocket
  }

  sendMessage(msg: any) {
    this.socket.next(msg);
  }

  getMessages() {
    return this.socket.asObservable();
  }

  closeConnection() {
    this.socket.complete(); // Ferme la connexion WebSocket
  }
}
