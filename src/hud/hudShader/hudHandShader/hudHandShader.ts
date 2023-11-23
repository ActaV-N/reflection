import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { Shader } from "../../../shader";
import { FRAGMENT, VERTEX } from "./hudHandShaderSource";

export class HudHandShader extends Shader {
  private positionAttributeLocation!: number;

  private vao!: WebGLVertexArrayObject;

  private vertices!: Float32Array;

  constructor(gl: WebGL2RenderingContext) {
    const source = {
      vertex: VERTEX,
      fragment: FRAGMENT,
    };
    super(gl, source);

    this.positionAttributeLocation = this.gl.getAttribLocation(
      this.program,
      "a_position"
    );

    this.vertices = new Float32Array([]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    this.vao = this.gl.createVertexArray()!;
    this.gl.bindVertexArray(this.vao);
  }

  animate() {
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertices,
      this.gl.STATIC_DRAW
    );

    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.gl.POINTS, 0, this.vertices.length / 2);
    const verticesCount = this.vertices.length / 2;
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, Math.min(21, verticesCount));
    if (verticesCount > 21) {
      this.gl.drawArrays(this.gl.TRIANGLE_FAN, 21, 21);
    }
  }

  updateVertices(normalizedLandmarks: NormalizedLandmark[][]) {
    const vertices = [];
    // const targetIndex = [0, 1, 5, 9,]
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 21; j++) {
        const landmark = normalizedLandmarks[i]?.[j];
        if (landmark) {
          const { x, y } = landmark;

          const targetX = x * 2 - 1;
          const targetY = -(y * 2 - 1);

          const currentX = this.vertices[i * 42 + j * 2] || targetX;
          const currentY = this.vertices[i * 42 + j * 2 + 1] || targetY;

          const nextX = currentX + (targetX - currentX) * 0.08;
          const nextY = currentY + (targetY - currentY) * 0.08;

          vertices.push(nextX, nextY);
        }
      }
    }
    this.vertices = new Float32Array(vertices);
  }
}
