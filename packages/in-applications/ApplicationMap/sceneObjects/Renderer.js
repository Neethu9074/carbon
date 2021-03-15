/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getWebGLCanvasContext } from 'in-map/services/webGL';
import { WebGLRenderer } from 'in-map/3DLibProvider';

export default class Renderer {
  constructor(canvas) {
    const renderer = (this.renderer = new WebGLRenderer({
      canvas: canvas,
      context: getWebGLCanvasContext(canvas),
      antialias: true
    }));

    renderer.setClearColor(0xffffff, 1.0);

    // objects organize matrix updates by themselves
    renderer.autoUpdateObjects = false;
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera.getRenderableCamera());
  }
}
