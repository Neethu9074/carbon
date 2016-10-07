import {create, on} from 'reactive-observables';

import {globeSize$} from 'in-components/globeView/stores/globeSizeStore';


export default function createUniverseRenderer({container, canvas}) {
  const changeSignal = true;
  const changes = create();
  const updateSubscription = changes.subscribe(update);

  let globeSize = 0;
  const globeSizeSubscription = globeSize$.subscribe(_size => {
    globeSize = _size;
    changes.emit(changeSignal);
  });

  const resizeSubscription = on(window, 'resize')
    .debounce(500)
    .subscribe(resize);

  // initial resize
  resize();

  return {
    canvas,
    dispose
  };

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.height = height;
    canvas.width = width;

    changes.emit(changeSignal);
  }

  function update() {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const heightInPercent = globeSize;
    const radius = 0.5 * (heightInPercent * height);
    const grd = ctx.createRadialGradient(width / 2, height / 2,
                                         radius,
                                         width / 2, height / 2,
                                         radius + 100);
    grd.addColorStop(0, '#36475e');
    grd.addColorStop(1, 'transparent');

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function dispose() {
    resizeSubscription.dispose();
    updateSubscription.dispose();
    globeSizeSubscription.dispose();
  }
}
