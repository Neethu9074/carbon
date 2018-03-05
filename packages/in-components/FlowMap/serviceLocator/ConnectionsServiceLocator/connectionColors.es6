import { hexToRGBNormalized } from 'in-services/formatters/color';

export const DEFAULT_COLOR = {
  r: 0.745,
  g: 0.8,
  b: 0.823
};

export const ERROR_COLORS = [
  hexToRGBNormalized('#e3e2b8'),
  hexToRGBNormalized('#eae18a'),
  hexToRGBNormalized('#f1e05c'),
  hexToRGBNormalized('#f8df2e'),
  hexToRGBNormalized('#ffde00'),
  hexToRGBNormalized('#ffbf08'),
  hexToRGBNormalized('#ffa010'),
  hexToRGBNormalized('#ff8019'),
  hexToRGBNormalized('#ff6121'),
  hexToRGBNormalized('#ff4229')
];

export default function getConnectionColor(errorRate = 0) {
  errorRate = Math.min(1, Math.max(0, errorRate)); // [0, 1]

  const indexInBetween = errorRate * (ERROR_COLORS.length - 1);
  const fromColor = ERROR_COLORS[Math.floor(indexInBetween)];
  const toColor = ERROR_COLORS[Math.ceil(indexInBetween)];
  const interpolationFactor = indexInBetween % 1;

  return {
    r: fromColor.r + interpolationFactor * (toColor.r - fromColor.r),
    g: fromColor.g + interpolationFactor * (toColor.g - fromColor.g),
    b: fromColor.b + interpolationFactor * (toColor.b - fromColor.b)
  };
}
