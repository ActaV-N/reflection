import * as THREE from "three";
import { Pointer } from "../../../libs";
import { bubbleFragmentShader, bubbleVertexShader } from "../../shaders";

export class mainPointer extends Pointer {
  public handMesh!: THREE.Mesh;

  private handMaterial!: THREE.ShaderMaterial;

  private handGeometry!: THREE.CircleGeometry;

  constructor() {
    super();
    this.handGeometry = new THREE.CircleGeometry(0.2, 300);
    this.handMaterial = new THREE.ShaderMaterial({
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      transparent: true,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uTime: { value: 0 },
        uScale: { value: 1 },
        uClosed: { value: false },
      },
    });

    this.handMesh = new THREE.Mesh(this.handGeometry, this.handMaterial);
  }
}
