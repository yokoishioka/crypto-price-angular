import { Injectable } from "@angular/core";
import * as Rx from "rxjs/Rx";

@Injectable()
export class WebsocketService {
  constructor() {}

  private subject: Rx.Subject<MessageEvent>;

  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      /*
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
      */
     ws.onopen = function () {
      ws.send(JSON.stringify({	
      "type": "subscribe",
      "channels": [{ "name": "ticker", "product_ids": [
        "BTC-USD",
        "ETH-USD",
        "LTC-USD"
      ] }]
  
    })); //send a message to server once connection is opened.
    };
      ws.onmessage = function(e)  {
        let data = JSON.parse(e.data);
        let thisCrypto = data.product_id.toString();
        let thisPrice = data.price;
        document.getElementById("pofs-crypto-prices-section").innerHTML = thisPrice;
        console.log("websocket says:" + e.data);
      };
      return () =>  {
        ws.close();
      };
    });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
}