import RoEmitter from 'roemitter';
import ReactDOM from 'react-dom';
import React from 'react';

import {highlightedTimeframe$} from 'in-stores/timeline/highlightedTimeframe';
import {onMove, onLeave} from 'in-services/reactiveMouseEvents';
import ApplyButton from 'in-charts/Chart/renderer/ApplyButton';


const WIDTH_OF_BUTTONS_IN_PX = 52;

export default function createHighlightedTimeframeRenderer(container, glassPane, canvas, scale) {
  const applyButtonContainer = document.createElement('div');
  applyButtonContainer.classList.add('in-timeline__apply-button-container');
  container.appendChild(applyButtonContainer);

  const eventEmitter = new RoEmitter();
  let highlightedTimeframe;

  hide();

  const highlightedTimeframeSubscription = highlightedTimeframe$
    .subscribe(_highlightedTimeframe => highlightedTimeframe = _highlightedTimeframe);

  const isVisibleSubscription = eventEmitter.on('isVisible')
    .distinct()
    .subscribe(isVisible => isVisible ? show() : hide());

  const mouseLeaveSubscription = onLeave(
    container,
    () => eventEmitter.emit('isVisible', false)
  );

  const mouseMoveSubscription = onMove(
    glassPane,
    e => {
      if (!highlightedTimeframe) {
        return;
      }

      let a = clamp(scale.getRange(highlightedTimeframe[0]));
      let b = clamp(scale.getRange(highlightedTimeframe[1]));
      const from = Math.min(a, b);
      const to = Math.max(a, b);
      (e.offsetX > from && e.offsetX < to)
        ? eventEmitter.emit('isVisible', true)
        : eventEmitter.emit('isVisible', false);
    }
  );

  return {
    update,
    dispose
  };

  function update() {
    if (highlightedTimeframe) {
      const to = Math.max(clamp(scale.getRange(highlightedTimeframe[0])),
                          clamp(scale.getRange(highlightedTimeframe[1])));

      if (to < WIDTH_OF_BUTTONS_IN_PX) {
        hide();
      }
      applyButtonContainer.style.left = `${Math.ceil(to) - WIDTH_OF_BUTTONS_IN_PX}px`;
      applyButtonContainer.style.right = null;
    } else {
      hide();
    }
  }

  function dispose() {
    highlightedTimeframeSubscription.dispose();
    mouseLeaveSubscription.dispose();
    mouseMoveSubscription.dispose();
    isVisibleSubscription.dispose();

    ReactDOM.unmountComponentAtNode(applyButtonContainer);
    eventEmitter.dispose();
  }

  function show() {
    ReactDOM.render(
      <ApplyButton />,
      applyButtonContainer
    );

    applyButtonContainer.style.display = 'block';
  }

  function hide() {
    applyButtonContainer.style.display = 'none';
  }

  function clamp(x) {
    return Math.max(0, Math.min(x, 100000));
  }
}
