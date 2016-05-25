import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {getTickPositions} from 'in-charts/timeAxis';
import {formatDateTime} from 'in-services/formatters/date';


const font = '12px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
const darkColorTransparent = 'rgba(46, 64, 72, 0)';
const darkColor = 'rgba(46, 64, 72, 1)';
const lightColor = '#80939c';
const midColor = '#43565e';

const edgeWidth = 250;

export default class TimeAxisRenderer extends BasicRenderer {

  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.leftGradient = this.backBuffer.createLinearGradient(0, 0, edgeWidth, 0);
    this.leftGradient.addColorStop(0, darkColor);
    this.leftGradient.addColorStop(0.5, darkColor);
    this.leftGradient.addColorStop(1, darkColorTransparent);
  }

  draw(axisConfig) {
    const tickPositions = getTickPositions(this.scale, axisConfig);
    const buffer = this.backBuffer;
    const scale = this.scale;

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

    buffer.fillStyle = this.leftGradient;
    buffer.fillRect(0, 0, edgeWidth, 40);

    // draw the stand and end time of the time window
    const rightGradient = this.backBuffer.createLinearGradient(
      scale.getRangeTo() - edgeWidth,
      0,
      scale.getRangeTo(),
      0
    );
    rightGradient.addColorStop(0, darkColorTransparent);
    rightGradient.addColorStop(0.5, darkColor);
    rightGradient.addColorStop(1, darkColor);
    buffer.fillStyle = rightGradient;
    buffer.fillRect(scale.getRangeTo() - edgeWidth, 0, edgeWidth, 40);

    // start
    buffer.fillStyle = lightColor;
    buffer.font = font;
    buffer.fillText(formatDateTime(scale.getDomainFrom()), 10, 28);
    buffer.textAlign = 'right';
    buffer.fillText(formatDateTime(scale.getDomainTo()), scale.getRangeTo() - 10, 28);
    buffer.textAlign = 'left';
  }

  dispose() {
    super.dispose();

    this.leftGradient = null;
  }
}
