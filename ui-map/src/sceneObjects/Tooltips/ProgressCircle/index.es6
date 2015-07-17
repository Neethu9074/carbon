'use strict';

import React from 'react/addons';
import Tooltip from '../Tooltip';
import TWEEN from 'tween.js';
import eventBus from 'instana-ui-services/eventbus';

import './index.less';


/*eslint-disable no-unused-vars*/
const ProgressCircle = React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  getInitialState() {
    return {value: 0};
  },

  componentDidMount() {
    const from = {value: 0};
    const to = {value: 1};
    const animation = new TWEEN.Tween(from).to(to, 500);
    animation.onUpdate((obj) => {
      this.setState({value: obj * 40});
    });
    animation.onComplete(() => eventBus.emit('longClicked'));
    animation.start();
    this.animation = animation;
  },

  componentWillUnmount() {
    this.animation.stop();
  },

  render() {
    const style = {width: this.state.value};

    return (
      <div className='in-tooltip__progress-background'>
        <div className='in-tooltip__progress' style={style}>
        </div>
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class TooltipProgressCircle extends Tooltip {
  constructor(parent) {
    super(parent);
    this.render();
  }

  render() {
    React.render(
      <ProgressCircle/>,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
