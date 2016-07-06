precision mediump float;
precision mediump int;

varying float fProgress;
varying float fLength;
varying vec3 vColor;


void main() {
  float partLength = 0.25 / fLength;
  float opacity = 1.0;

  if (mod(fProgress, partLength * 2.0) < partLength) {
    opacity = 0.0;
  }

  gl_FragColor = vec4( vColor.rgb, opacity );
}
