precision mediump float;
precision mediump int;

varying float fPointSize;
varying vec3 vColor;

void main() {
  float maxSize = 20.0;

  gl_FragColor = vec4(vColor, min(1.0, fPointSize / maxSize));
}
