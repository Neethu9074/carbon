export default function createPositionGenerator() {

  function getPositionForParticle() {
    const size = 0.2;

    return {
      x: (Math.random() * size) - (size / 2),
      y: (Math.random() * size) - (size / 2),
      z: 0
    };
  }

  return {
    getPositionForParticle
  };
}
