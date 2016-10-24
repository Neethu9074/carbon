const camPosition = {
  x: null,
  y: null
};

function getPosition() {
  return camPosition;
}

function setPosition(x, y) {
  camPosition.x = x;
  camPosition.y = y;
}

export default {
  getPosition,
  setPosition
};
