import React from 'react/addons';
import * as ro from 'reactive-observables';

import keyCodes from 'in-components/keyCodes';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import tourDefinition from './tours/001_instana_demo';

import './Tour.less';

const tourViewedLocalStorageKey = 'in-tour-viewed';
const margin = 10;
const block = 'in-guided-tour';

const GuidedTour = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  getInitialState() {
    const tourId = String(tourDefinition.id);
    const tourHasBeenSeen = window.localStorage.getItem(tourViewedLocalStorageKey) === tourId;
    return {
      activeStep: 0,
      tourHasBeenSeen
    };
  },

  componentDidMount() {
    if (this.state.tourHasBeenSeen) return;

    this.addSubscription(ro.on(window, 'resize').subscribe(this.onResize));
    this.addSubscription(ro.on(window, 'keyup').subscribe(this.onKeyUp));

    this.onResize();
  },

  componentDidUpdate() {
    if (this.state.tourHasBeenSeen) {
      this.stopTour();
    } else {
      this.onResize();
    }
  },

  onResize() {
    this.positionOverlay(tourDefinition.steps[this.state.activeStep].element);
  },

  positionOverlay(focusedElement) {
    if (typeof focusedElement === 'string') {
      focusedElement = document.querySelector(focusedElement);
    }
    const clientRect = focusedElement.getBoundingClientRect();

    const top = React.findDOMNode(this.refs.top);
    top.style.top = 0;
    top.style.left = toPx(clientRect.left - margin);
    top.style.width = toPx(clientRect.width + 2 * margin);
    top.style.height = toPx(clientRect.top - margin);

    const left = React.findDOMNode(this.refs.left);
    left.style.top = 0;
    left.style.left = 0;
    left.style.bottom = 0;
    left.style.width = toPx(clientRect.left - margin);

    const bottom = React.findDOMNode(this.refs.bottom);
    bottom.style.top = toPx(clientRect.top + clientRect.height + margin);
    bottom.style.left = toPx(clientRect.left - margin);
    bottom.style.width = toPx(clientRect.width + margin * 2);
    bottom.style.bottom = 0;

    const right = React.findDOMNode(this.refs.right);
    right.style.top = 0;
    right.style.left = toPx(clientRect.left + clientRect.width + margin);
    right.style.right = 0;
    right.style.bottom = 0;
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
    window.localStorage.setItem(tourViewedLocalStorageKey, String(tourDefinition.id));
    this.setState({
      tourHasBeenSeen: true
    });
  },

  nextStep() {
    if (this.state.activeStep + 1 >= tourDefinition.steps.length) {
      this.stopTour();
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1
      });
    }
  },

  previousStep() {
    this.setState({
      activeStep: Math.max(this.state.activeStep - 1, 0)
    });
  },

  render() {
    if (this.state.tourHasBeenSeen) return null;

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
