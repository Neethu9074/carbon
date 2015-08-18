import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import * as tracking from 'in-services/tracking';
import toPx from 'in-services/converters/toPx';
import keyCodes from 'in-components/keyCodes';
import Button from 'in-components/Button';

import {tourDefinition, observable} from './tours/001_instana_demo';

import './Tour.less';

const tourViewedLocalStorageKey = 'in-tour-viewed';
const block = 'in-guided-tour';
const dialogMargin = 30;
const margin = 10;

const GuidedTour = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    Navigation
  ],

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

    tracking.trackEvent(tracking.events.startATour);

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
    const step = tourDefinition.steps[this.state.activeStep];
    let focusedElement = tourDefinition.steps[this.state.activeStep].element;
    let clientRect = null;

    if (step.visited) {
      focusedElement = '.in-guided-tour__blocker';
    }

    if (focusedElement) {
      if (typeof focusedElement === 'string') {
        focusedElement = document.querySelector(focusedElement);
        if(!focusedElement) {
          focusedElement = document.querySelector('.in-guided-tour__blocker');
        }
      }
      clientRect = focusedElement.getBoundingClientRect();
    }

    this.positionOverlay(clientRect);
    this.positionDialog(clientRect);
    step.visited = true;
  },

  positionOverlay(clientRect) {
    const bottomStyle = React.findDOMNode(this.refs.bottom).style;
    const rightStyle = React.findDOMNode(this.refs.right).style;
    const leftStyle = React.findDOMNode(this.refs.left).style;
    const topStyle = React.findDOMNode(this.refs.top).style;

    topStyle.top = leftStyle.top = leftStyle.left = leftStyle.bottom =
    bottomStyle.bottom = rightStyle.top = rightStyle.right = rightStyle.bottom =
    0;

    if (clientRect) {
      topStyle.left = toPx(clientRect.left - margin);
      topStyle.width = toPx(clientRect.width + 2 * margin);
      topStyle.height = toPx(clientRect.top - margin);
      leftStyle.width = toPx(clientRect.left - margin);

      bottomStyle.top = toPx(clientRect.top + clientRect.height + margin);
      bottomStyle.left = toPx(clientRect.left - margin);
      bottomStyle.width = toPx(clientRect.width + margin * 2);

      rightStyle.left = toPx(clientRect.left + clientRect.width + margin);
    } else {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      topStyle.left = toPx(windowWidth / 2);
      topStyle.width = toPx(0);
      topStyle.height = toPx(windowHeight / 2);

      leftStyle.width = toPx(windowWidth / 2);

      bottomStyle.top = toPx(windowHeight / 2);
      bottomStyle.left = toPx(windowWidth / 2);
      bottomStyle.width = 0;

      rightStyle.left = toPx(windowWidth / 2);
    }
  },

  positionDialog(clientRect) {
    const dialog = React.findDOMNode(this.refs.dialog);
    const dialogDimensions = dialog.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

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
      this.skipTour();
    } else if (keyCode === keyCodes.arrows.right) {
      this.nextStep();
    } else if (keyCode === keyCodes.arrows.left) {
      this.previousStep();
    }
  },

  stopTour() {
    observable.dispose();

    this.disposeSubscriptions();
    window.localStorage.setItem(tourViewedLocalStorageKey, String(tourDefinition.id));

    this.setState({ tourHasBeenSeen: true });
  },

  skipTour() {
    tracking.trackEvent(tracking.events.skipATour);
    this.stopTour();
  },

  nextStep() {
    const currentStep = tourDefinition.steps[this.state.activeStep];
    if (currentStep && currentStep.after) {
      currentStep.after(this);
    }

    if (this.state.activeStep + 1 >= tourDefinition.steps.length) {
      tracking.trackEvent(tracking.events.finishATour);
      this.stopTour();

    } else {
      tracking.trackEvent(tracking.events.nextStepInTour);
      const nextStepIndex = this.state.activeStep + 1;
      const step = tourDefinition.steps[nextStepIndex];
      if (step.before && !step.beforeExecuted) {
        step.beforeExecuted = true;
        step.before(this);
      }
      this.setState({
        activeStep: nextStepIndex
      });
    }
  },

  previousStep() {
    tracking.trackEvent(tracking.events.previousStepInTour);

    const currentStep = this.state.activeStep;
    const step = tourDefinition.steps[currentStep];

    //undo the current step
    if(step && step.undo) {
      step.undo(this);
    }

    this.setState({ activeStep: Math.max(currentStep - 1, 0) });
  },

  tourFinished() {
    tourDefinition.steps[this.state.activeStep].after();

    this.stopTour();
  },

  render() {
    if (this.state.tourHasBeenSeen) return null;

    const step = tourDefinition.steps[this.state.activeStep];
    return (
      <div className={block + '__overlay'}>

        <div className={block + '__overlay-fragment'} ref='top'></div>
        <div className={block + '__overlay-fragment'} ref='right'></div>
        <div className={block + '__overlay-fragment'} ref='bottom'></div>
        <div className={block + '__overlay-fragment'} ref='left'></div>

        <div className={block + '__blocker'}></div>

        <section className={block + '__dialog'} ref='dialog'>
          <header className={block + '__dialog-header'}>
            <div className={block + '__progress'}>
              Hint {this.state.activeStep + 1} / {tourDefinition.steps.length}
            </div>
            <div className={block + '__skip'}
                 onClick={this.skipTour}>
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
                {tourDefinition.steps[this.state.activeStep].nextStepLabel ?
                tourDefinition.steps[this.state.activeStep].nextStepLabel :
                'Next'}
              </Button>
            : null }
            {this.state.activeStep === tourDefinition.steps.length - 1 ?
              <Button onClick={this.tourFinished}>
                {tourDefinition.steps[this.state.activeStep].nextStepLabel ?
                tourDefinition.steps[this.state.activeStep].nextStepLabel :
                'Finish'}
              </Button>
            : null }
          </nav>

        </section>
      </div>
    );
  }
});

export default GuidedTour;
