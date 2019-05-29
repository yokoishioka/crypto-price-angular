import { Component } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { ChatService } from "./chat.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [WebsocketService, ChatService]
})
export class AppComponent {
  constructor(private chatService: ChatService) {
    chatService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
  }

  private message = {
    "type": "subscribe",
    "channels": [{ "name": "ticker", "product_ids": [
      "BTC-USD",
      "ETH-USD",
      "LTC-USD"
    ] }]
  };

  sendMsg() {
    console.log("clients says to websocket: ", this.message);
    this.chatService.messages.next(this.message);
    //this.message.message = "";
  }
}