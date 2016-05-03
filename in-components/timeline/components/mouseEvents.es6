import * as ro from 'reactive-observables';


export default function createMouseEvents(canvas, component) {

  let isDragging = false;

  const mouseUpSubscription = ro.on(canvas, 'mouseup').subscribe(e => {
    component.onMouseUp(e.offsetX, e.offsetY);
    isDragging = false;
  });

  const mouseLeaveSubscription = ro.on(canvas, 'mouseleave').subscribe(e => {
    component.onMouseUp(e.offsetX, e.offsetY);
    isDragging = false;
  });

  const mouseDownSubscription = ro.on(canvas, 'mousedown').subscribe(e => {
    component.onMouseDown(e.offsetX, e.offsetY);
    isDragging = true;
  });

  const mouseMoveSubscription = ro.on(canvas, 'mousemove')
    .throttle(100)
    .subscribe(e => {
      component.onMouseMove(e.offsetX, e.screenX);
      if (isDragging) {
        component.onDrag(e.offsetX, e.offsetX - e.movementX);
      }
  });


  return {
    dispose
  };

  function dispose() {
    mouseLeaveSubscription.dispose();
    mouseDownSubscription.dispose();
    mouseMoveSubscription.dispose();
    mouseUpSubscription.dispose();
  }
}
