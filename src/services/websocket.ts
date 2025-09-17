export default class WebsocketService {
  private baseUrl: string;
  private onMessage: (this: WebSocket, ev: MessageEvent<unknown>) => void;
  private websocketInstance: null | WebSocket;

  constructor(onWebsocketUpdate: (this: WebSocket, ev: MessageEvent<unknown>) => void) {
    this.baseUrl = import.meta.env.VITE_BOLAO_WS_BASE_URL;
    this.onMessage = onWebsocketUpdate;
    this.websocketInstance = null;
  }

  public close() {
    this.websocketInstance?.close();
  }

  public async connect(endpoint: string) {
    const url = `ws://localhost:63768/bolaonfl/${endpoint}`;
    this.websocketInstance = new WebSocket(url);
    this.websocketInstance.onopen = () => console.log('WS opened');
    this.websocketInstance.onmessage = this.onMessage;
    this.websocketInstance.onclose = () => console.log('WS closed');

    return this.websocketInstance;
  }
}
