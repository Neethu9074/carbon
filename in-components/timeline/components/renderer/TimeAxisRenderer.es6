import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {getTickPositions} from 'in-charts/timeAxis';

const font = '12px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
const lightColor = '#80939c';
const midColor = '#43565e';

export default class TimeAxisRenderer extends BasicRenderer {

  constructor(backBuffer, scale) {
    super(backBuffer, scale);
  }

  draw(axisConfig) {
    const tickPositions = getTickPositions(this.scale, axisConfig);
    const buffer = this.backBuffer;

    for (let i = 0, length = tickPositions.length; i < length; i++) {
      const position = tickPositions[i];
      const x = Math.ceil(position.range);

      // draw line
      buffer.fillStyle = midColor;
      buffer.fillRect(x, 35, 1, 5);

      // draw time text
      buffer.fillStyle = lightColor;
      buffer.font = font;
      buffer.fillText(axisConfig.formatter(position.domain), x, 28);
    }
  }
}
