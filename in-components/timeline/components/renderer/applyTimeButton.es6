import RoEmitter from 'roemitter';
import ReactDOM from 'react-dom';
import React from 'react';

import {highlightedTimeframe$} from 'in-stores/timeline/highlightedTimeframe';
import {applyTimeButtonEnabled} from 'in-services/featureFlags';
import {onMove, onLeave} from 'in-services/reactiveMouseEvents';
import ApplyButton from 'in-charts/Chart/renderer/ApplyButton';


export default function createHighlightedTimeframeRenderer(container, canvas, scale) {
  if (!applyTimeButtonEnabled) {
    return {
      dispose() {},
      update() {}
    };
  }

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
    canvas,
    e => {
      if (!highlightedTimeframe) {
        return;
      }

      const from = clamp(scale.getRange(highlightedTimeframe[0]));
      const to = clamp(scale.getRange(highlightedTimeframe[1]));
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
      const to = clamp(scale.getRange(highlightedTimeframe[1]));

      applyButtonContainer.style.left = `${to}px`;
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
