import { IPAD_CONST } from "../../const";

export abstract class Pointer {
  declare public handMesh: THREE.Mesh;

  declare protected handMaterial: THREE.ShaderMaterial;

  declare protected handGeometry: THREE.CircleGeometry;

  protected targetPosition!: { x: number; y: number };

  protected movingInterpolation: number = 0.05 * IPAD_CONST;

  protected targetScale: number = 1.0;

  protected scaleV: number = 0;

  public moveHandTo(position: {x: number; y: number}, interpolation: number): void {
    this.handMesh.position.x =
      this.handMesh.position.x +
      (position.x - this.handMesh.position.x) * interpolation;
    this.handMesh.position.y =
      this.handMesh.position.y +
      (position.y - this.handMesh.position.y) * interpolation;
  }

  public setHandPosition(position: {x: number; y: number}): void {
    this.handMesh.position.x = position.x;
    this.handMesh.position.y = position.y;
  }

  // TODO: animate, event handlers
  
  // Move event handler
  public moveEventHandler(event: AllEvents[EventType]) {
    const { x, y } = (event as MoveEvent).hand;

      this.targetPosition = { x, y };
  }

  // Open event handler

  // Grab event handler

  // Hand detect event handler

  // Hand lost event handler
}
