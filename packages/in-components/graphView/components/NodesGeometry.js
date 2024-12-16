/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable no-console */
import { init as initGlyphTexture, glyphTexture, config } from 'in-map/singleMeshFactories/pluginIconsGlyphTexture';
import fragmentShader from 'in-components/graphView/components/nodeFragmentShader.glsl';
import vertexShader from 'in-components/graphView/components/nodeVertexShader.glsl';
import BaseGeometry from 'in-components/graphView/components/BaseGeometry';
import { Points } from 'in-map/3DLibProvider';

export default class NodesGeometry extends BaseGeometry {
  constructor() {
    super();

    this.setColors([]);
    initGlyphTexture();
    this.material.uniforms.texture = { type: 't', value: glyphTexture };
    this.material.uniforms.numColumns = { type: 'f', value: config.numElementsPerColumn };
  }

  getShader() {
    return {
      vertexShader,
      fragmentShader
    };
  }

  getMesh(geometry, material) {
    return new Points(geometry, material);
  }

  updateGeometry(graph) {
    const vertices = [];
    const colors = [];
    const uvCoords = [];
    const textureWidth = config.numElementsPerColumn * config.iconWidth;

    let i = 0;
    let i2 = 0;
    graph.eachNode(node => {
      const pos = node.springyNode.position;
      const color = node.color;

      vertices[i++] = pos.x;
      vertices[i++] = pos.y;
      vertices[i++] = pos.z;

      colors[i2++] = color.r;
      colors[i2++] = color.g;
      colors[i2++] = color.b;

      const xy = config.LUT[node.plugin];
      if (!xy) {
        // use right bottom UV coords to show nothing but emptiness
        uvCoords.push(0);
        uvCoords.push(0);
        //console.debug('unable to find icon for %s', node.plugin);
      } else {
        uvCoords.push(xy.x / textureWidth);
        uvCoords.push(xy.y / textureWidth);
      }
    });

    this.setVertices(vertices);
    this.setColors(colors);
    this.setUVs(uvCoords);
  }
}
