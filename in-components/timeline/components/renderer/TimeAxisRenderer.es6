import { font, darkColorTransparent, darkColor, lightColor, midColor } from 'in-components/timeline/timelineConfig';
import { getTickPositions } from 'in-charts/timeAxis';

const edgeWidth = 260;

export default function createTimeAxisRenderer(ctx, scale) {
  const leftGradient = ctx.createLinearGradient(0, 0, edgeWidth, 0);
  leftGradient.addColorStop(0, darkColor);
  leftGradient.addColorStop(0.5, darkColor);
  leftGradient.addColorStop(1, darkColorTransparent);

  return {
    draw
  };

  function draw(axisConfig) {
    // full width / max pixels per timestamp
    const maxSteps = Math.ceil((scale.getRangeTo() - scale.getRangeFrom()) / 180);

    const windowSize = scale.getDomainTo() - scale.getDomainFrom();

    // copy object so that we do not manipulate the axis config
    axisConfig = Object.create(axisConfig);
    axisConfig.stepSize = Math.max(axisConfig.stepSize, windowSize / maxSteps);

    const tickPositions = getTickPositions(scale, axisConfig);

    for (let i = 0, length = tickPositions.length; i < length; i++) {
      const position = tickPositions[i];
      const x = Math.ceil(position.range);

      // draw line
      ctx.fillStyle = midColor;
      ctx.fillRect(x, 29, 1, 7);

      // draw time text
      ctx.fillStyle = lightColor;
      ctx.font = font;
      ctx.fillText(axisConfig.formatter(position.domain), x + 3, 32);
    }

    ctx.fillStyle = leftGradient;
    ctx.fillRect(0, 0, edgeWidth, 36);

    // draw the start and end time of the time window
    const rightGradient = ctx.createLinearGradient(scale.getRangeTo() - edgeWidth, 0, scale.getRangeTo(), 0);
    rightGradient.addColorStop(0, darkColorTransparent);
    rightGradient.addColorStop(0.5, darkColor);
    rightGradient.addColorStop(1, darkColor);
    ctx.fillStyle = rightGradient;
    ctx.fillRect(scale.getRangeTo() - edgeWidth, 0, edgeWidth + 19, 36);

    ctx.fillStyle = '#334750';
    ctx.fillRect(0, 18, scale.getRangeTo() - scale.getRangeFrom(), 1);

    // mark the start and end
    ctx.fillStyle = midColor;
    ctx.fillRect(scale.getRangeFrom(), 27, 1, 9);
    ctx.fillRect(scale.getRangeTo(), 27, 1, 9);
  }
}
