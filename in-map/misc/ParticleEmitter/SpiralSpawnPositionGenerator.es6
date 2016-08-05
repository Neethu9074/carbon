export default function createPositionGenerator() {
  let angle = 0;

  function getPositionForParticle() {
    const size = 0.1;
    angle += 1;

    return {
      x: size * Math.cos(angle),
      y: size * Math.sin(angle),
      z: 0
    };
  }

  return {
    getPositionForParticle
  };
}
