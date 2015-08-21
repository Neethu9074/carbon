attribute float custAttr;
uniform float progress;
varying vec3 vColor;

void main() {
  vColor = color;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position.x, position.y + custAttr * progress, position.z, 1.0);
}
