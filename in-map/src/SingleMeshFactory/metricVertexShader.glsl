attribute float oldHeight;
attribute float newHeight;
uniform float progress;
varying vec3 vColor;

void main() {
  vColor = color;

  float deltaHeights = newHeight - oldHeight;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position.x, oldHeight + deltaHeights * progress, position.z, 1.0);
}
