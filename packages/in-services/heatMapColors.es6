export const DEFAULT_COLOR = {
  r: 0.65,
  g: 0.7,
  b: 0.72
};

let DEFAULT_HEAT_MAP_COLORS = null;
function getColorPalette() {
  if (DEFAULT_HEAT_MAP_COLORS) {
    return DEFAULT_HEAT_MAP_COLORS;
  }
  DEFAULT_HEAT_MAP_COLORS = [
    { r: 0.89, g: 0.886, b: 0.721 },
    { r: 0.917, g: 0.882, b: 0.541 },
    { r: 0.945, g: 0.878, b: 0.36 },
    { r: 0.972, g: 0.874, b: 0.18 },
    { r: 1, g: 0.87, b: 0 },
    { r: 1, g: 0.749, b: 0.031 },
    { r: 1, g: 0.627, b: 0.062 },
    { r: 1, g: 0.501, b: 0.098 },
    { r: 1, g: 0.38, b: 0.129 },
    { r: 1, g: 0.258, b: 0.16 }
  ];
  return DEFAULT_HEAT_MAP_COLORS;
}

export default function getHeatMapColor(intensity = 0, colorPalette) {
  intensity = Math.min(1, Math.max(0, intensity)); // [0, 1]

  colorPalette = colorPalette || getColorPalette();
  const indexInBetween = intensity * (colorPalette.length - 1);
  const fromColor = colorPalette[Math.floor(indexInBetween)];
  const toColor = colorPalette[Math.ceil(indexInBetween)];
  const interpolationFactor = indexInBetween % 1;

  return {
    r: fromColor.r + interpolationFactor * (toColor.r - fromColor.r),
    g: fromColor.g + interpolationFactor * (toColor.g - fromColor.g),
    b: fromColor.b + interpolationFactor * (toColor.b - fromColor.b)
  };
}
