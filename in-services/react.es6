import * as ro from 'reactive-observables';


export function getClassName(reactClass, baseClass, appendix = '') {
  if (reactClass.props.className) {
    return baseClass + appendix + ' ' + reactClass.props.className + appendix;
  }
  return baseClass + appendix;
}

export function mutateWithMouseEvents(domNode, component) {
  const events = component.mouseEvents = {};

    events._mouseDownSubscription = ro.on(domNode, 'mouseup').subscribe(e => {
      component.onMouseUp(e.offsetX, e.offsetY);
      events._isDragging = false;
    });

    events._mouseDownSubscription = ro.on(domNode, 'mouseleave').subscribe(e => {
      component.onMouseUp(e.offsetX, e.offsetY);
      events._isDragging = false;
    });

    events._mouseDownSubscription = ro.on(domNode, 'mousedown').subscribe(e => {
      component.onMouseDown(e.offsetX, e.offsetY);
      events._isDragging = true;
    });

    events._mouseDragSubscription = ro.on(domNode, 'mousemove')
      .subscribe(e => {
        if (events._isDragging) {
          component.onDrag(e.offsetX, e.offsetX - e.movementX);
        }
    });
}

export function disposeMouseEvents(component) {
  const events = component.mouseEvents;
  if (!events) {
    return;
  }

  disposeIfPresent(events._mouseDownSubscription);
  disposeIfPresent(events._mouseDragSubscription);
  disposeIfPresent(events._mouseUpSubscription);

  component.mouseEvents = undefined;
}

function disposeIfPresent(func) {
  if (func) {
    func.dispose();
  }
}
