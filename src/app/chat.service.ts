import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import { WebsocketService } from "./websocket.service";

const CHAT_URL = "wss://ws-feed.pro.coinbase.com";

export interface Message {
  "type": string; "channels": { "name": string; "product_ids": string[]; }[]; 
}

@Injectable()
export class ChatService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).map(
      (response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          type: data.type,
          channels: data.channels
        };
      }
    );
  }
}