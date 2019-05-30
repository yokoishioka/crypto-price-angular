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
  title="Yoko\'s Crypto Price Tracker using two services"
  constructor(private chatService: ChatService) {
    chatService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
  }

}