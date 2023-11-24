type EventType = "click";
interface Hand {
  x: number;
  y: number;
  // TODO: event type 정의하면 event type으로 바꿀 것.
  gesture: string;
}

type PointEvent = Hand;

interface IEventHandler {
  (event: PointEvent): void | Promise<void>,
}

interface IEventListener {
  (event: EventType, handler: IEventHandler): void;
  (
    event: EventType,
    handler: IEventHandler
  ): void;
  (
    event: EventType,
    handler: IEventHandler
  ): void;
}

interface HUD {
  resize(): void;

  animate(): void;

  addEventListener: IEventListener;
}

interface Artwork {
  resize(): void;

  animate(): void;
}

interface ScreenSaver {
  resize(): void;

  animate(): void;
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