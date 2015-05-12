uniform float progress;
varying vec3 vColor;

void main() {
  vColor = color;

  float targetHeight = uv.x;
  float oldHeight = uv.y;
  float delta = targetHeight - oldHeight;
  float height = oldHeight + (delta * progress);

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position.x, height, position.z, 1.0);
}
