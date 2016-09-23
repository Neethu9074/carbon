import {font} from 'in-components/timeline/timelineConfig';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {getTickPositions} from 'in-charts/timeAxis';


export default function createTimeAxisRenderer(screenBuffer, scale, height) {

  function render() {
    const axisConfig = getAxisConfig(scale.getDomainTo() - scale.getDomainFrom());
    const tickPositions = getTickPositions(scale, axisConfig);

    for (let i = 0, length = tickPositions.length; i < length; i++) {
      const position = tickPositions[i];
      const x = Math.ceil(position.range);

      // draw line
      screenBuffer.fillStyle = '#e2e9ec';
      screenBuffer.fillRect(x, 0, 1, height);

      // draw time text
      screenBuffer.fillStyle = '#92a5ae';
      screenBuffer.font = font;
      screenBuffer.fillText(axisConfig.formatter(position.domain), x, 9);
    }
  }

  return {
    render
  };
}
