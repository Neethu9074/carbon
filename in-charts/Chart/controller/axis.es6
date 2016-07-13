import createScale from 'in-charts/scale';

export default function createAxisController(config) {
  const scales = config.scales = createScales();

  return {
    resize
  };


  function resize() {
    scales.x.setRangeFrom(config.bounds.left);
    scales.x.setRangeTo(config.bounds.right);

    scales.y1.setRangeFrom(config.bounds.top);
    scales.y1.setRangeTo(config.bounds.bottom);
    if (scales.y2) {
      scales.y2.setRangeFrom(config.bounds.top);
      scales.y2.setRangeTo(config.bounds.bottom);
    }
  }

  function createScales() {
    const result = {};

    result.x = createScale();
    result.y1 = createScale();

    if (config.y2) {
      result.y2 = createScale();
    }

    return result;
  }
}
