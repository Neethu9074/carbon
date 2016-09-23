import {on, create} from 'reactive-observables';

import createBackgroundRenderer from
  'in-components/eventView/components/eventDetails/IncidentPopulationChart/backgroundRenderer';
import createTimeAxisRenderer from
  'in-components/eventView/components/eventDetails/IncidentPopulationChart/timeAxisRenderer';
import {updateCanvasDimensions} from 'in-charts/canvas';


export default function createTimelineRenderer({container, canvas, scale}) {
  const height = 100;
  let width;

  const screenBuffer = canvas.getContext('2d');

  const backgroundRenderer = createBackgroundRenderer(screenBuffer, scale, height);
  const timeAxisRenderer = createTimeAxisRenderer(screenBuffer, scale, height);


  const resizeSubscription = on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  const changeSignal = true;
  const changes = create();
  const drawSubscription = changes
    .debounce(300)
    .subscribe(render);

  // initial resize
  resize();

  function resize() {
    width = container.clientWidth;

    updateCanvasDimensions(canvas, screenBuffer, width, height);
    changes.emit(changeSignal);
  }

  function render() {
    backgroundRenderer.render();
    timeAxisRenderer.render();
  }

  function dispose() {
    drawSubscription.dispose();
    resizeSubscription.dispose();
  }

  return {
    render,
    dispose
  };
}
