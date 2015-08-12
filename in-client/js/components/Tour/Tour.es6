import React from 'react/addons';

import './Tour.less';

const margin = 10;
const block = 'in-guided-tour';

const GuidedTour = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    // TODO Define props
    // foo: rpt.string.isRequired
  },

  componentDidMount() {
    this.createOverlay();

    setTimeout(() => {
      this.positionOverlay(document.querySelector('.in-floating-frame__header'));

      setTimeout(() => {
        this.positionOverlay(document.querySelector('.in-map'));
      }, 3000);

      setTimeout(() => {
        this.positionOverlay(document.querySelector('.in-root-lettering'));
      }, 6000);
    }, 1000);

  },

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = block + '__overlay';
    document.body.appendChild(this.overlay);

    this.clickBlocker = document.createElement('div');
    this.clickBlocker.className = block + '__blocker';
    this.overlay.appendChild(this.clickBlocker);

    this.overlays = {
      top: this.createOverlayFragment(),
      right: this.createOverlayFragment(),
      bottom: this.createOverlayFragment(),
      left: this.createOverlayFragment()
    };
  },

  createOverlayFragment() {
    const fragment = document.createElement('div');
    fragment.className = block + '__overlay-fragment';
    this.overlay.appendChild(fragment);
    return fragment;
  },

  positionOverlay(element) {
    const clientRect = element.getBoundingClientRect();

    this.overlays.top.style.top = 0;
    this.overlays.top.style.left = toPx(clientRect.left - margin);
    this.overlays.top.style.width = toPx(clientRect.width + 3 * margin);
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

  render() {
    // this component is only responsible for controlling intro.js. Intro.js
    // itself is responsible for rendering
    return null;
  }
});

export default GuidedTour;

function toPx(v) {
  // handle cases where the DOM style attribute is translating negative to
  // positive pixels values.
  if (v < 0) return 0;
  return v + 'px';
}
