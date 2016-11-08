import {on} from 'reactive-observables';
import RoEmitter from 'roemitter';
import ReactDOM from 'react-dom';
import React from 'react';

import {applyTimeButtonEnabled} from 'in-services/featureFlags';
import {highlightedTimeframe$} from 'in-stores/timeline/highlightedTimeframe';
import ApplyButton from 'in-charts/Chart/renderer/ApplyButton';


export default function createHighlightedTimeframeRenderer(config) {
  if (!applyTimeButtonEnabled) {
    return {
      dispose() {},
      update() {}
    };
  }
  const eventEmitter = new RoEmitter();
  let highlightedTimeframe;

  hide();

  config.subscriptions.push(
    on(config.dom.wrapper, 'mouseleave')
    .subscribe(() => eventEmitter.emit('isVisible', false)));

  config.subscriptions.push(eventEmitter.on('isVisible')
    .distinct()
    .subscribe(isVisible => isVisible ? show() : hide()));

  config.subscriptions.push(highlightedTimeframe$
    .throttle(20)
    .subscribe(tf => highlightedTimeframe = tf));

  config.subscriptions.push(
    on(config.dom.glassPane, 'mousemove')
    .subscribe(e => {
      if (!highlightedTimeframe) {
        return;
      }

      const from = clamp(config.scales.x.getRange(highlightedTimeframe[0]));
      const to = clamp(config.scales.x.getRange(highlightedTimeframe[1]));
      (e.offsetX > from && e.offsetX < to)
        ? eventEmitter.emit('isVisible', true)
        : eventEmitter.emit('isVisible', false);
    }));

  return {
    update,
    dispose
  };

  function update() {
    if (highlightedTimeframe) {
      const to = clamp(config.scales.x.getRange(highlightedTimeframe[1]));

      config.dom.applyButtonContainer.style.left = `${to}px`;
      config.dom.applyButtonContainer.style.right = null;
    } else {
      hide();
    }
  }

  function dispose() {
    ReactDOM.unmountComponentAtNode(config.dom.applyButtonContainer);
    eventEmitter.dispose();
  }

  function show() {
    ReactDOM.render(
      <ApplyButton />,
      config.dom.applyButtonContainer
    );

    config.dom.applyButtonContainer.style.display = 'block';
  }

  function hide() {
    config.dom.applyButtonContainer.style.display = 'none';
  }

  function clamp(x) {
    return Math.max(Math.min(x, config.bounds.right), config.bounds.left);
  }
}
