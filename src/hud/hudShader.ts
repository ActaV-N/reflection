import { Shader } from "../shader";

export class HudShader extends Shader {
  private positionAttributeLocation!: number;

  private vao!: WebGLVertexArrayObject;

  private vertices!: Float32Array;

  constructor(gl: WebGL2RenderingContext, source: { vertex: string; fragment: string }) {
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
    this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.vertices.length / 2);
  }

  updateVertices(vertices: Float32Array) {
    this.vertices = vertices;
  }
}
