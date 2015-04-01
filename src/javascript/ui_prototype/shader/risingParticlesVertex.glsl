uniform float amplitude;
varying float alpha;

void main() {
  float maxHeight = 5.0;
  vec3 newPosition = position;
  newPosition.y += amplitude;
  if(newPosition.y > maxHeight) {
    newPosition.y -= maxHeight;
  }
  float percent = newPosition.y / maxHeight;

  alpha = 1.0 - percent;

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  gl_PointSize = 2.0 * ( 300.0 / length( mvPosition.xyz ) );

  gl_Position = projectionMatrix * mvPosition;
}
