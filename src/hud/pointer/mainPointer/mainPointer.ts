import * as THREE from "three";
import { Pointer } from "../../../libs";
import { fragmentShader, vertexShader } from "./shader";

export class MainPointer extends Pointer {
  constructor() {
    super();
    this.handGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    this.handMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
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
