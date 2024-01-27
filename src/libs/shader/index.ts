export abstract class Shader {
  public program!: WebGLProgram;

  constructor(
    protected gl: WebGL2RenderingContext,
    source: {
      vertex: string;
      fragment: string;
    }
  ) {
    // Vertex shader
    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      source.vertex
    )!;

    // Fragment shader
    const fragShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      source.fragment
    )!;

    this.program = this.gl.createProgram()!;

    this.gl.attachShader(this.program, vertexShader);
    this.gl.deleteShader(vertexShader);
    this.gl.attachShader(this.program, fragShader);
    this.gl.deleteShader(fragShader);

    this.gl.linkProgram(this.program);

    const log = this.gl.getProgramInfoLog(this.program);
    if (log) {
      console.log("### Program log", log);
      this.gl.deleteProgram(this.program);
    }
  }

  private createShader(type: number, source: string) {
    const shader = this.gl.createShader(type);
    if (shader) {
      this.gl.shaderSource(shader, source);

      this.gl.compileShader(shader);
    }

    return shader;
  }

  abstract animate(): void;
}
