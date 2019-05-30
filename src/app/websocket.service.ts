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
    let lastbtc:String = "0";
    let lasteth:String = "0";
    let lastltc:String = "0";
    let lastCrypto;
    let ws:WebSocket = new WebSocket(url);

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
        console.log("websocket says:" + e.data);
        let thisCrypto:String = data.product_id.toString().toLowerCase();
        thisCrypto = thisCrypto.split("-")[0];
        lastCrypto = "last" + thisCrypto;
        let thisPrice = parseFloat(data.price).toFixed(2);

        if (thisCrypto === "btc") {
          if (thisPrice !== lastbtc) {
            
            let p = document.createElement("p");
            let node = document.createTextNode("this: " + thisPrice + "last: " + lastbtc);
            
            p.append(node);
            document.getElementById("pofs-crypto-prices-" + thisCrypto).append(p);
            lastbtc = thisPrice;
         }
       }
       else if (thisCrypto === "eth") {
        if (thisPrice !== lasteth) {
          
          let p = document.createElement("p");
          let node = document.createTextNode("this: " + thisPrice + "last: " + lasteth);
          
          p.append(node);
          document.getElementById("pofs-crypto-prices-" + thisCrypto).append(p);
          lasteth = thisPrice;
       }
     }
     else if (thisCrypto === "ltc") {
      if (thisPrice !== lastltc) {
        
        let p = document.createElement("p");
        let node = document.createTextNode("this: " + thisPrice + "last: " + lastltc);
        
        p.append(node);
        document.getElementById("pofs-crypto-prices-" + thisCrypto).append(p);
        lastltc = thisPrice;
     }

   }

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