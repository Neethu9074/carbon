uniform float progress;
varying vec3 vColor;

void main() {
  vColor = color;
  float height = position.y;

  if(height > 0.0) {
    float targetHeight = uv.x;
    float oldHeight = uv.y;
    float delta = targetHeight - oldHeight;
    float eplison = 0.01;

    height = oldHeight + (delta * progress);

    if((targetHeight - height) < eplison) {
      height -= eplison;
    }
  }

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position.x, height, position.z, 1.0);
}
