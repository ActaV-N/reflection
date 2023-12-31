type ArtworkTitle = "screenSaver" | "untitled";
type EventType = "grab" | "open" | "handdetected" | "handlost" | "move";
interface Hand {
  x: number;
  y: number;
  // TODO: event type 정의하면 event type으로 바꿀 것.
  gesture: string;
}

interface PointEvent {
  name: EventType;
  hand: Hand;
};

interface HandLostEvent implements PointEvent {
  name: 'handlost',
  hand: null,
}

interface HandDetectedEvent implements PointEvent {
  name: 'handdetected',
  hand: Hand,
}

interface GrabEvent implements PointEvent {
  name: 'grab',
  hand: Hand,
}

interface OpenEvent implements PointEvent {
  name: 'open',
  hand: Hand,
}

interface MoveEvent implements PointEvent {
  name: 'move',
  hand: Hand,
}

type AllEvents = {
  'grab': GrabEvent,
  'open': OpenEvent,
  'handdetected': HandDetectedEvent,
  'handlost': HandLostEvent,
  'move': MoveEvent,
}
type IEventHandler<T = AllEvents[keyof AllEvents]> = (event: T) => void;


interface IEventListener {
  (event: EventType, handler: IEventHandler<AllEvents[EventType]>): void;
}

interface HUD {
  point: Hand;

  resize(): void;

  render(): void;

  addEventListener: IEventListener;
}
interface Artwork {
  resize(): void;

  render(delta: number, rtt: boolean): void;

  setRenderer(renderer: THREE.WebGLRenderer): void;

  renderTarget: THREE.WebGLRenderTarget;
}

interface ScreenSaver implements Artwork {
  resize(): void;

  render(delta: number, rtt: boolean): void;

  setRenderer(renderer: THREE.WebGLRenderer): void;

  renderTarget: THREE.WebGLRenderTarget;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}
declare module '*.vert' {
  const value: string;
  export default value;
}
declare module '*.frag' {
  const value: string;
  export default value;
}
