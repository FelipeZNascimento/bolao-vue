type OnMessageHandler = (this: WebSocket, ev: MessageEvent<unknown>) => void;

let sharedInstance: WebSocket | null = null;

export default class WebsocketService {
  private baseUrl: string;
  private onMessage: OnMessageHandler;

  constructor(onWebsocketUpdate: OnMessageHandler) {
    this.baseUrl = import.meta.env.VITE_BOLAO_WS_BASE_URL;
    this.onMessage = onWebsocketUpdate;
  }

  public close() {
    if (sharedInstance) {
      sharedInstance.close();
      sharedInstance = null;
    }
  }

  public connect() {
    if (
      sharedInstance &&
      (sharedInstance.readyState === WebSocket.OPEN || sharedInstance.readyState === WebSocket.CONNECTING)
    ) {
      sharedInstance.onmessage = this.onMessage;
      return sharedInstance;
    }

    sharedInstance = new WebSocket(this.baseUrl);
    sharedInstance.onopen = () => console.log('WS opened');
    sharedInstance.onmessage = this.onMessage;
    sharedInstance.onclose = () => console.log('WS closed');

    return sharedInstance;
  }
}
