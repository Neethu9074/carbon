export default function createBackgroundRenderer(screenBuffer, scale, height) {

  function render() {
    const width = scale.getRangeTo() - scale.getRangeFrom();

    // fill whole canvas with color of lines
    screenBuffer.fillStyle = '#fff';
    screenBuffer.fillRect(0, 0, width, height);
  }

  return {
    render
  };
}
