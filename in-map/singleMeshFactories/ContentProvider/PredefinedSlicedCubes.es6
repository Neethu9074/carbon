import {updateAttribute} from 'in-map/services/geometryAttributes';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {BufferGeometry} from 'in-map/3DLibProvider';
import {theme} from 'in-services/theme';


export const NUM_POINTS_PER_SLICE = 54;
const FRONT = theme.map.colors.cubeColorFalloffValues.right;
const TOP = theme.map.colors.cubeColorFalloffValues.top;
const DEFAULT_FALLOFF_COLORS = [
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,

  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,
  FRONT.r, FRONT.g, FRONT.b,

  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,

  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,
  TOP.r, TOP.g, TOP.b,

  1, 1, 1,
  1, 1, 1,
  1, 1, 1,

  1, 1, 1,
  1, 1, 1,
  1, 1, 1
];

const ALL_COLORS = [];
for (let i = 0; i < theme.chart.strokeColors.length; i++) {
  const rgb = hexToRGBNormalized(theme.chart.strokeColors[i]);
  for (let j = 0; j < DEFAULT_FALLOFF_COLORS.length; j += 3) {
    ALL_COLORS.push(DEFAULT_FALLOFF_COLORS[j]     * rgb.r,
                    DEFAULT_FALLOFF_COLORS[j + 1] * rgb.g,
                    DEFAULT_FALLOFF_COLORS[j + 2] * rgb.b);
  }
}

const PREDEFINED_VERTICES = {
  1: calculateVertices(1),
  5: calculateVertices(5)
};

const PREDEFINED_COLORS = {
  1: ALL_COLORS.slice(0, NUM_POINTS_PER_SLICE),
  5: ALL_COLORS.slice(0, NUM_POINTS_PER_SLICE * 5)
};


export function getSlicedGeometry(numSlices) {
  let vertices = PREDEFINED_VERTICES[numSlices];
  if (!vertices) {
    vertices = PREDEFINED_VERTICES[numSlices] = calculateVertices(numSlices);
  }

  let colors = PREDEFINED_COLORS[numSlices];
  if (!colors) {
    colors = PREDEFINED_COLORS[numSlices] = ALL_COLORS.slice(0, NUM_POINTS_PER_SLICE * numSlices);
  }

  const sharedHeights = new Array(numSlices * NUM_POINTS_PER_SLICE);
  for (let i = 0, length = sharedHeights.length; i < length; i++) {
    sharedHeights[i] = 0;
  }

  const geometry = new BufferGeometry();
  updateAttribute(geometry, 'position', vertices);
  updateAttribute(geometry, 'color', colors);
  updateAttribute(geometry, 'oldHeight', sharedHeights, 1);
  updateAttribute(geometry, 'newHeight', sharedHeights, 1);
  return geometry;
}

function calculateVertices(numSlices) {
  const vertices = [];
  for (let i = 0; i < numSlices; i++) {
    vertices.push(
      // front
      -0.5, 0, 0.5,
      0.5, 0, 0.5,
      0.5, 1, 0.5,

      -0.5, 0, 0.5,
      0.5, 1, 0.5,
      -0.5, 1, 0.5,

      // top
      -0.5, 1, 0.5,
      0.5, 1, 0.5,
      0.5, 1, -0.5,

      -0.5, 1, 0.5,
      0.5, 1, -0.5,
      -0.5, 1, -0.5,

      // left
      -0.5, 0, -0.5,
      -0.5, 0, 0.5,
      -0.5, 1, -0.5,

      -0.5, 0, 0.5,
      -0.5, 1, 0.5,
      -0.5, 1, -0.5
    );
  }
  return vertices;
}

export const INDEX_MASK = [];
for (let i = 0; i < theme.chart.strokeColors.length; i++) {
  INDEX_MASK.push(
    // front
    i,
    i,
    i + 1,

    i,
    i + 1,
    i + 1,

    // top
    i + 1,
    i + 1,
    i + 1,

    i + 1,
    i + 1,
    i + 1,

    // left
    i,
    i,
    i + 1,

    i,
    i + 1,
    i + 1
  );
}
