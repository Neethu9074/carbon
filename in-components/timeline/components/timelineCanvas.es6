import * as ro from 'reactive-observables';


export default function createTimelineRenderer({canvas}) {
  const resizeSubscription = ro.on(window, 'resize')
  .debounce(500)
  .subscribe(() => {

  });

  return {
    canvas,
    dispose
  };

  function dispose() {
    resizeSubscription.dispose();
  }
}
