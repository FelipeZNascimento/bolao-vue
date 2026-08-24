type OnMessageHandler = (this: WebSocket, ev: MessageEvent<unknown>) => void;

const BACKOFF_INITIAL_MS = 1_000;
const BACKOFF_MAX_MS = 30_000;

let sharedInstance: WebSocket | null = null;

export default class WebsocketService {
  private baseUrl: string;
  private onMessage: OnMessageHandler;
  private onReconnect: (() => void) | null;
  private visibilityHandler: (() => void) | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = BACKOFF_INITIAL_MS;
  // Prevents backoff retries after an intentional close()
  private intentionallyClosed = false;

  constructor(onWebsocketUpdate: OnMessageHandler, onReconnect?: () => void) {
    this.baseUrl = import.meta.env.VITE_BOLAO_WS_BASE_URL;
    this.onMessage = onWebsocketUpdate;
    this.onReconnect = onReconnect ?? null;
  }

  public close() {
    this.intentionallyClosed = true;
    this.clearReconnectTimer();
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    if (sharedInstance) {
      sharedInstance.close();
      sharedInstance = null;
    }
  }

  public connect() {
    this.intentionallyClosed = false;
    this.clearReconnectTimer();

    if (
      sharedInstance &&
      (sharedInstance.readyState === WebSocket.OPEN || sharedInstance.readyState === WebSocket.CONNECTING)
    ) {
      sharedInstance.onmessage = this.onMessage;
      return sharedInstance;
    }

    sharedInstance = new WebSocket(this.baseUrl);

    sharedInstance.onopen = () => {
      console.log('WS opened');
      this.reconnectDelay = BACKOFF_INITIAL_MS;
    };

    sharedInstance.onmessage = this.onMessage;

    sharedInstance.onclose = () => {
      console.log('WS closed');
      if (!this.intentionallyClosed) {
        this.scheduleReconnect();
      }
    };

    sharedInstance.onerror = () => {
      // onclose always fires after onerror, so backoff is handled there
      console.warn('WS error');
    };

    this.registerVisibilityHandler();

    return sharedInstance;
  }

  private scheduleReconnect() {
    this.clearReconnectTimer();
    console.log(`WS: reconnecting in ${this.reconnectDelay}ms...`);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
      this.onReconnect?.();
    }, this.reconnectDelay);
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, BACKOFF_MAX_MS);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private registerVisibilityHandler() {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }

    this.visibilityHandler = () => {
      if (document.visibilityState !== 'visible') return;

      const isConnected =
        sharedInstance?.readyState === WebSocket.OPEN || sharedInstance?.readyState === WebSocket.CONNECTING;

      if (!isConnected) {
        console.log('WS: tab became visible, reconnecting...');
        // Cancel any pending backoff — reconnect immediately on user return
        this.reconnectDelay = BACKOFF_INITIAL_MS;
        this.connect();
      }

      // Always refresh state on tab focus — messages may have been missed
      this.onReconnect?.();
    };

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }
}
