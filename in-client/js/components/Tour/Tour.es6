import React from 'react';
import * as ro from 'reactive-observables';

import keyCodes from 'in-components/keyCodes';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import tourDefinition from './tours/001_instana_demo';

import './Tour.less';

const tourViewedLocalStorageKey = 'in-tour-viewed';
const margin = 10;
const block = 'in-guided-tour';

const GuidedTour = React.createClass({
  mixins: [SubscriptionMixin],

  shouldComponentUpdate() {
    return false;
  },

  componentDidMount() {
    if (this.hasTourBeenSeenBefore()) {
      return;
    }

    this.activeStep = 0;
    this.createOverlay();

    this.addSubscription(ro.on(window, 'resize').subscribe(this.onResize));
    this.addSubscription(ro.on(window, 'keyup').subscribe(this.onKeyUp));

    this.onResize();
  },

  positionOverlay(focusedElement) {
    if (typeof focusedElement === 'string') {
      focusedElement = document.querySelector(focusedElement);
    }
    const clientRect = focusedElement.getBoundingClientRect();

    this.overlays.top.style.top = 0;
    this.overlays.top.style.left = toPx(clientRect.left - margin);
    this.overlays.top.style.width = toPx(clientRect.width + 2 * margin);
    this.overlays.top.style.height = toPx(clientRect.top - margin);

    this.overlays.left.style.top = 0;
    this.overlays.left.style.left = 0;
    this.overlays.left.style.bottom = 0;
    this.overlays.left.style.width = toPx(clientRect.left - margin);

    this.overlays.bottom.style.top = toPx(clientRect.top + clientRect.height + margin);
    this.overlays.bottom.style.left = toPx(clientRect.left - margin);
    this.overlays.bottom.style.width = toPx(clientRect.width + margin * 2);
    this.overlays.bottom.style.bottom = 0;

    this.overlays.right.style.top = 0;
    this.overlays.right.style.left = toPx(clientRect.left + clientRect.width + margin);
    this.overlays.right.style.right = 0;
    this.overlays.right.style.bottom = 0;
  },

  onResize() {
    this.positionOverlay(tourDefinition.steps[this.activeStep].element);
  },

  onKeyUp(e) {
    const keyCode = e.keyCode;

    if (keyCode === keyCodes.escape) {
      this.stopTour();
    } else if (keyCode === keyCodes.arrows.right) {
      this.nextStep();
    } else if (keyCode === keyCodes.arrows.left) {
      this.previousStep();
    }
  },

  stopTour() {
    this.disposeSubscriptions();
    this.markTourAsViewed();
    document.body.removeChild(this.overlay);
  },

  nextStep() {
    if (this.activeStep + 1 >= tourDefinition.steps.length) {
      this.stopTour();
    } else {
      this.activeStep++;
      this.onStepChanged();
    }
  },

  previousStep() {
    this.activeStep = Math.max(this.activeStep - 1, 0);
    this.onStepChanged();
  },

  onStepChanged() {
    this.positionOverlay(tourDefinition.steps[this.activeStep].element);
  },

  markTourAsViewed() {
    window.localStorage.setItem(tourViewedLocalStorageKey, String(tourDefinition.id));
  },

  hasTourBeenSeenBefore() {
    return window.localStorage.getItem(tourViewedLocalStorageKey) === String(tourDefinition.id);
  },

  render() {
    // this component is only responsible for controlling intro.js. Intro.js
    // itself is responsible for rendering
    // return null;

    return (
      <div className={block + '__overlay'}>
        <div className={block + '__overlay-fragment'}></div>

        <div className={block + '__overlay-fragment'} ref='top'></div>
        <div className={block + '__overlay-fragment'} ref='right'></div>
        <div className={block + '__overlay-fragment'} ref='bottom'></div>
        <div className={block + '__overlay-fragment'} ref='left'></div>
      </div>
    );
  }
});

export default GuidedTour;

function toPx(v) {
  // handle cases where the DOM style attribute is translating negative to
  // positive pixels values, e.g. left: -10px is translated to left: 10px.
  if (v < 0) return 0;
  return v + 'px';
}
