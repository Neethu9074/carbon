import {on} from 'reactive-observables';
import RoEmitter from 'roemitter';
import ReactDOM from 'react-dom';
import React from 'react';

import {highlightedTimeframe$} from 'in-stores/timeline/highlightedTimeframe';
import ApplyButton from 'in-charts/Chart/renderer/ApplyButton';


const WIDTH_OF_BUTTONS_IN_PX = 52;

export default function createHighlightedTimeframeRenderer(config) {
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
      const to = Math.max(clamp(config.scales.x.getRange(highlightedTimeframe[0])),
                          clamp(config.scales.x.getRange(highlightedTimeframe[1])));

      if (to < WIDTH_OF_BUTTONS_IN_PX + config.margins.left) {
        hide();
      }
      config.dom.applyButtonContainer.style.left = `${Math.ceil(to)- WIDTH_OF_BUTTONS_IN_PX}px`;
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
