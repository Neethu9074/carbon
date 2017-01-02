import BasicRenderer from 'in-components/timeline/components/renderer/BasicRenderer';
import {getTickPositions} from 'in-charts/timeAxis';

import {
  font,
  darkColorTransparent,
  darkColor,
  lightColor,
  midColor
} from 'in-components/timeline/timelineConfig';


const edgeWidth = 260;

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
      buffer.fillText(axisConfig.formatter(position.domain), x + 3, 32);
    }

    buffer.fillStyle = this.leftGradient;
    buffer.fillRect(0, 0, edgeWidth, 36);

    // draw the start and end time of the time window
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
    buffer.fillRect(scale.getRangeTo() - edgeWidth, 0, edgeWidth + 19, 36);

    buffer.fillStyle = '#334750';
    buffer.fillRect(0, 18, scale.getRangeTo() - scale.getRangeFrom(), 1);
  }

  dispose() {
    super.dispose();

    this.leftGradient = null;
  }
}
