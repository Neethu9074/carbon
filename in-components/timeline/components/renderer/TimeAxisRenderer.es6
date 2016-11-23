import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {formatDate, formatTime} from 'in-services/formatters/date';
import {getTickPositions} from 'in-charts/timeAxis';

import {
  font,
  darkColorTransparent,
  darkColor,
  lightColor,
  midColor
} from 'in-components/timeline/timelineConfig';


const edgeWidth = 170;

export default class TimeAxisRenderer extends BasicRenderer {

  constructor(backBuffer, scale) {
    super(backBuffer, scale);

    this.leftGradient = this.backBuffer.createLinearGradient(0, 0, edgeWidth, 0);
    this.leftGradient.addColorStop(0, darkColor);
    this.leftGradient.addColorStop(0.5, darkColor);
    this.leftGradient.addColorStop(1, darkColorTransparent);
  }

  draw(axisConfig) {
    const scale = this.scale;
    // full width / max pixels per timestamp
    const maxSteps = Math.ceil((scale.getRangeTo() - scale.getRangeFrom()) / 180);

    const windowSize = scale.getDomainTo() - scale.getDomainFrom();

    // copy object so that we do not manipulate the axis config
    axisConfig = Object.create(axisConfig);
    axisConfig.stepSize = Math.max(axisConfig.stepSize, windowSize / maxSteps);


    const tickPositions = getTickPositions(this.scale, axisConfig);
    const buffer = this.backBuffer;

    for (let i = 0, length = tickPositions.length; i < length; i++) {
      const position = tickPositions[i];
      const x = Math.ceil(position.range);

      // draw line
      buffer.fillStyle = midColor;
      buffer.fillRect(x, 29, 1, 7);

      // draw time text
      buffer.fillStyle = lightColor;
      buffer.font = font;
      buffer.fillText(axisConfig.formatter(position.domain), x, 26);
    }

    buffer.fillStyle = this.leftGradient;
    buffer.fillRect(0, 0, edgeWidth, 36);

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
    buffer.fillRect(scale.getRangeTo() - edgeWidth, 0, edgeWidth + 20, 36);

    // start
    buffer.fillStyle = '#6b8088';
    buffer.font = font;
    buffer.fillText(formatDate(scale.getDomainFrom()), scale.getRangeFrom(), 15);
    buffer.fillText(formatTime(scale.getDomainFrom()), scale.getRangeFrom(), 30);
    buffer.textAlign = 'right';
    buffer.fillText(formatDate(scale.getDomainTo()), scale.getRangeTo() - 10, 15);
    buffer.fillText(formatTime(scale.getDomainTo()), scale.getRangeTo() - 10, 30);
    buffer.textAlign = 'left';
  }

  dispose() {
    super.dispose();

    this.leftGradient = null;
  }
}
