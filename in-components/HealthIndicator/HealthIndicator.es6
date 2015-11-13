import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getHealth, getProblemsForSnapshot} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getClassName} from 'in-services/react';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import './HealthIndicator.less';

const rpt = React.PropTypes;
const block = 'in-healthindicator';
const progToDeg = 2 * Math.PI;
const offset = - (progToDeg / 4);

const HealthIndicator = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    className: rpt.string
  },

  getInitialState() {
    return { sumSeverities: 0, currentHealth: undefined };
  },

  componentDidMount() {
    this.addSubscription(getProblemsForSnapshot(this.props.snapshot).map(problems => {
      // sum all severities
      return problems.reduce((acc, problem) => {
        const severity = problem.get('severity');
        return acc + severity;
      }, 0);
    }).subscribe(sumSeverities => this.setState({ sumSeverities })));

    this.addSubscription(getHealth(this.props.snapshot).subscribe(h => this.setState({ currentHealth: h })));
  },

  componentDidUpdate() {
    const progress = this.getProgress();

    this.drawArc({ canvasName: 'outerCanvas', radius: 20, to: 2, color: '#72838a' });
    this.drawArc({ canvasName: 'outerCanvas', radius: 20, to: progress, color: theme.health[progress * 10 | 0] });

    this.drawArc({ canvasName: 'middleCanvas', radius: 12, to: 2, color: '#72838a' });
    this.drawArc({ canvasName: 'middleCanvas', radius: 12, to: progress, color: theme.health[progress * 10 | 0] });
  },

  drawArc({ canvasName, to, color, radius }) {
    const ctx = this.refs[canvasName].getDOMNode().getContext('2d');
    ctx.beginPath();
    ctx.arc(25, 25, radius, offset, offset + to * progToDeg);
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.stroke();
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
        <canvas ref='outerCanvas'
                width='50px'
                height='50px'
                className={block + '__canvas'}/>

        <canvas ref='middleCanvas'
                width='50px'
                height='50px'
                className={block + '__canvas'}/>

        <div className={block + '__inner-circle'}
             style={{ backgroundColor: this.calculateColorForHealth(this.state.currentHealth) }}/>
      </div>
    );
  },

  calculateColorForHealth(hostHealth) {
    const colors = theme.map.colors;

    if (hostHealth === health.warning) {
      return colors.warning;
    } else if (hostHealth === health.danger) {
      return colors.critical;
    }
    return '#72838a';
  },

  getProgress() {
    const sum = this.state.sumSeverities;
    return Math.min(1, sum / 10); // [0, 1]
  }
});

export default HealthIndicator;
