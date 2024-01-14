import { GESTURE, IPAD_CONST } from "../../const";

export abstract class Pointer {
  public declare handMesh: THREE.Mesh;

  protected declare handMaterial: THREE.ShaderMaterial;

  protected declare handGeometry: THREE.CircleGeometry;

  protected targetPosition: { x: number; y: number } = {
    x: 0,
    y: -0.6,
  };

  protected movingInterpolation: number = 0.05 * IPAD_CONST;

  protected targetScale: number = 1.0;

  protected scaleV: number = 0;

  private defaultPosition: { x: number; y: number } = { x: 0, y: 0 };

  public moveHandTo(
    position: { x: number; y: number },
    interpolation: number,
  ): void {
    this.handMesh.position.x =
      this.handMesh.position.x +
      (position.x - this.handMesh.position.x) * interpolation;
    this.handMesh.position.y =
      this.handMesh.position.y +
      (position.y - this.handMesh.position.y) * interpolation;
  }

  public setDefaultPosition(position: { x: number; y: number }): void {
    this.handMesh.position.x = position.x;
    this.handMesh.position.y = position.y;

    this.defaultPosition.x = position.x;
    this.defaultPosition.y = position.y;
  }

  // TODO: animate, event handlers

  // Move event handler
  public moveHandler(event: AllEvents[EventType]) {
    const { x, y } = (event as MoveEvent).hand;
    this.targetPosition = { x, y };
  }

  // Open event handler
  public openHandler(event: AllEvents[EventType]) {
    // Control shader Uniforms
    this.scaleV = 0;
    this.targetScale = 0.7;

    /**
     * Control shader Uniforms
     */
    // isClosed
    this.handMaterial.uniforms.uClosed = {
      value: false,
    };
  }

  // Grab event handler
  public grabHandler(event: AllEvents[EventType]) {
    // Inner interpolation
    this.targetScale = 0.4;

    /**
     * Control shader Uniforms
     */
    // isClosed
    this.handMaterial.uniforms.uClosed = {
      value: true,
    };
  }

  // Hand detect event handler
  public handDetectHandler(event: AllEvents[EventType]) {
    // Inner interpolation
    this.targetScale = 0.7;
  }

  // Hand lost event handler
  public handLostHandler(event: AllEvents[EventType]) {
    this.targetPosition = this.defaultPosition;
    // Inner interpolation
    this.targetScale = 1.0;
  }

  public handleGesture(gesture: (typeof GESTURE)[keyof typeof GESTURE]) {
    /**
     * Control shader Uniforms
     */
    // Scale
    const currentScale = this.handMaterial.uniforms.uScale.value;
    let nextScale;
    if (gesture === GESTURE.OPEN) {
      this.scaleV += (this.targetScale - currentScale) / 15;
      this.scaleV *= 0.88;

      nextScale = currentScale + this.scaleV;
    } else {
      nextScale =
        currentScale + (this.targetScale - currentScale) * 0.08 * IPAD_CONST;
    }
    this.handMaterial.uniforms.uScale = {
      value: nextScale,
    };
  }

  public render(elapsedTime: number) {
    this.handMaterial.uniforms.uTime = { value: elapsedTime / 10 };
    this.moveHandTo(this.targetPosition, this.movingInterpolation);
  }
}
