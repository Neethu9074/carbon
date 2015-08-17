import React from 'react/addons';
import * as ro from 'reactive-observables';

import Button from 'in-components/Button';
import keyCodes from 'in-components/keyCodes';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import tourDefinition from './tours/001_instana_demo';

import './Tour.less';

const tourViewedLocalStorageKey = 'in-tour-viewed';
const margin = 10;
const dialogMargin = 30;
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
    let focusedElement = tourDefinition.steps[this.state.activeStep].element;
    let clientRect = null;
    if (focusedElement) {
      if (typeof focusedElement === 'string') {
        focusedElement = document.querySelector(focusedElement);
      }
      clientRect = focusedElement.getBoundingClientRect();
    }
    this.positionOverlay(clientRect);
    this.positionDialog(clientRect);
  },

  positionOverlay(clientRect) {
    const top = React.findDOMNode(this.refs.top);
    const right = React.findDOMNode(this.refs.right);
    const bottom = React.findDOMNode(this.refs.bottom);
    const left = React.findDOMNode(this.refs.left);

    if (clientRect) {
      top.style.top = 0;
      top.style.left = toPx(clientRect.left - margin);
      top.style.width = toPx(clientRect.width + 2 * margin);
      top.style.height = toPx(clientRect.top - margin);

      left.style.top = 0;
      left.style.left = 0;
      left.style.bottom = 0;
      left.style.width = toPx(clientRect.left - margin);

      bottom.style.top = toPx(clientRect.top + clientRect.height + margin);
      bottom.style.left = toPx(clientRect.left - margin);
      bottom.style.width = toPx(clientRect.width + margin * 2);
      bottom.style.bottom = 0;

      right.style.top = 0;
      right.style.left = toPx(clientRect.left + clientRect.width + margin);
      right.style.right = 0;
      right.style.bottom = 0;
    } else {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      top.style.top = 0;
      top.style.left = toPx(windowWidth / 2);
      top.style.width = toPx(0);
      top.style.height = toPx(windowHeight / 2);

      right.style.top = 0;
      right.style.left = toPx(windowWidth / 2);
      right.style.right = 0;
      right.style.bottom = 0;

      bottom.style.top = toPx(windowHeight / 2);
      bottom.style.left = toPx(windowWidth / 2);
      bottom.style.width = 0;
      bottom.style.bottom = 0;

      left.style.top = 0;
      left.style.left = 0;
      left.style.bottom = 0;
      left.style.width = toPx(windowWidth / 2);
    }
  },

  positionDialog(clientRect) {
    const dialog = React.findDOMNode(this.refs.dialog);
    const dialogDimensions = dialog.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x;
    let y;

    if (clientRect) {
      x = clientRect.width + clientRect.left + dialogMargin;
      y = clientRect.top;

      if (x > windowWidth / 2) {
        x = clientRect.left - dialogDimensions.width - dialogMargin;
      }

      if (y > windowHeight / 2) {
        y = clientRect.top - dialogDimensions.height - dialogMargin;
      }

      x = Math.max(x, dialogMargin);
      y = Math.max(y, dialogMargin);
    } else {
      x = windowWidth / 2 - dialogDimensions.width / 2;
      y = windowHeight / 2 - dialogDimensions.height / 2;

      if (x + dialogDimensions.width > windowWidth) {
        x = dialogMargin;
      }

      if (y + dialogDimensions.height > windowHeight) {
        y = dialogMargin;
      }
    }

    dialog.style.transform = `translate(${toPx(x)}, ${toPx(y)})`;
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
      const nextStepIndex = this.state.activeStep + 1;
      const step = tourDefinition.steps[nextStepIndex];
      if (step.before && !step.beforeExecuted) {
        step.beforeExecuted = true;
        step.before();
      }
      this.setState({
        activeStep: nextStepIndex
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

    const step = tourDefinition.steps[this.state.activeStep];
    return (
      <div className={block + '__overlay'}>
        <div className={block + '__overlay-fragment'}></div>

        <div className={block + '__overlay-fragment'} ref='top'></div>
        <div className={block + '__overlay-fragment'} ref='right'></div>
        <div className={block + '__overlay-fragment'} ref='bottom'></div>
        <div className={block + '__overlay-fragment'} ref='left'></div>

        <section className={block + '__dialog'} ref='dialog'>
          <header className={block + '__dialog-header'}>
            <div className={block + '__progress'}>
              Hint {this.state.activeStep + 1} / {tourDefinition.steps.length}
            </div>
            <div className={block + '__skip'}
                 onClick={this.stopTour}>
              Skip this tour
            </div>
          </header>

          <main>
            <h1 className={block + '__title'}>{step.title}</h1>
            <p className={block + '__text'}>{step.text}</p>
          </main>

          <nav className={block + '__navigation'}>
            {this.state.activeStep > 0 ?
              <span>
                <Button onClick={this.previousStep}>
                  Previous
                </Button>
                &nbsp;
              </span>
            : null }

            {this.state.activeStep < tourDefinition.steps.length - 1 ?
              <Button onClick={this.nextStep}>
                Next
              </Button>
            : null }
            {this.state.activeStep === tourDefinition.steps.length - 1 ?
              <Button onClick={this.stopTour}>
                Finish
              </Button>
            : null }
          </nav>

        </section>
      </div>
    );
  }
});

export default GuidedTour;

function toPx(v) {
  // handle cases where the DOM style attribute is translating negative to
  // positive pixel values, e.g. left: -10px is translated to left: 10px.
  if (v < 0) return '0px';
  return (v | 0) + 'px';
}
