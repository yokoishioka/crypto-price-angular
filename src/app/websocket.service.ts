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
    let lastPriceBTC = 0;
    let lastPriceETH = 0;
    let lastPriceLTC = 0;

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

        let thisCrypto = data.product_id.toString();
        let thisPrice = data.price;
        let thisDate = new Date().toLocaleDateString("en-US");
        let thisTime = new Date().toLocaleTimeString("en-US");
        var currencyOptions = { style: 'currency', currency: 'USD' };
        var changeToDollar = new Intl.NumberFormat('en-US', currencyOptions);
        
        let writeCryptoPrice = function(lastPrice) {
          let priceDifference = thisPrice - lastPrice;
          if (lastPrice < thisPrice)  {
            document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML = "<p>" + thisDate + " " + thisTime + " - <span style='color:cadetblue'>" + changeToDollar.format(thisPrice) + " ▲" + changeToDollar.format(priceDifference) + "</span></p>" + document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML;
          }
          else {
            document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML = "<p>" + thisDate + " " + thisTime + " - <span  style='color:indianred'>" + changeToDollar.format(thisPrice) + " ▼" + changeToDollar.format(priceDifference) + "</span></p>" + document.getElementById("pofs-crypto-prices-" + thisCrypto.toLowerCase()).innerHTML;
          }	
  
        };
        if (thisCrypto === "BTC-USD" && lastPriceBTC !== thisPrice) {			
          writeCryptoPrice(lastPriceBTC);
          lastPriceBTC = thisPrice;
          
        }
        else if (thisCrypto === "ETH-USD" && lastPriceETH !== thisPrice) {	
          writeCryptoPrice(lastPriceETH);
          lastPriceETH = thisPrice;
          
        }
        else if (thisCrypto === "LTC-USD" && lastPriceLTC !== thisPrice) {			
          writeCryptoPrice(lastPriceLTC);
          lastPriceLTC = thisPrice;
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