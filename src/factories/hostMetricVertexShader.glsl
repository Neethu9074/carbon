varying vec3 vColor;

void main() {
  vColor = color;

  float height = position.y;
  if(height > 0.0) {height = uv.x;}

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position.x, height, position.z, 1.0);
}
