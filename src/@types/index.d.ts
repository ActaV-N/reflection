type EventType = "leftclick" | "rightclick" | "click";

type Point = {
  x: number;
  y: number;
  // TODO: event type 정의하면 event type으로 바꿀 것.
  gesture: string;
};

type PointEvent = Point & { position: 'left' | 'right' | 'both' };

interface Hands {
  left: Point;
  right: Point;
}

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
