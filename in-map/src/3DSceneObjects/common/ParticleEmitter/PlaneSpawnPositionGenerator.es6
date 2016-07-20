const SIZE = 0.2;
const NUM_SAMPLES = 100;
const PRE_DEFINED_SPAWN_POSITION_SAMPLES = Array.apply(null, Array(NUM_SAMPLES)).map(() =>
  Math.random() * SIZE - (SIZE / 2));

let index = 0;
function getNextSample() {
  const sample = PRE_DEFINED_SPAWN_POSITION_SAMPLES[index++];
  if (index >= NUM_SAMPLES) {
    index = 0;
  }
  return sample;
}

export default function createPositionGenerator() {

  function getPositionForParticle() {
    return {
      x: getNextSample(),
      y: getNextSample(),
      z: 0
    };
  }

  return {
    getPositionForParticle
  };
}
