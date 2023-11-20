import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { Shader } from "../../../shader";
import { FRAGMENT, VERTEX } from "./hudPointShaderSource";

export class HudPointShader extends Shader {
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

    this.vertices = new Float32Array([0, 0, 0, 0]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    this.vao = this.gl.createVertexArray()!;
    this.gl.bindVertexArray(this.vao);
  }

  animate() {
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertices,
      this.gl.DYNAMIC_DRAW
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
  }

  updateVertices(normalizedLandmarks: NormalizedLandmark[][]) {
    const vertices = []
    for (const landmarks of normalizedLandmarks) {
      const {x, y} = landmarks[9];
      vertices.push(x * 2 - 1, -(y * 2 - 1));
    }
    this.vertices = new Float32Array(vertices);
  }
}
