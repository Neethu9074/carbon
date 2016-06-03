precision mediump float;
precision mediump int;

varying float fPointSize;

void main() {
  float maxSize = 20.0;

  gl_FragColor = vec4(1.0, 1.0, 1.0, min(1.0, fPointSize / maxSize));
}
