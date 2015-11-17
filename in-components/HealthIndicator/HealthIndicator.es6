import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {
  getHealth,
  getAggregatedIssuesForSnapshot,
  analysisWindows
} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getClassName} from 'in-services/react';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import connectTo from '../hoc/connectTo';

import './HealthIndicator.less';

const rpt = React.PropTypes;
const block = 'in-healthindicator';
const progToDeg = 2 * Math.PI;
const offset = - (progToDeg / 4);

export default connectTo(
  props => {
    return {
      currentHealth: getHealth(props.snapshot),
      oneDayAggregate: getAggregatedIssuesForSnapshot(props.snapshot, analysisWindows.oneDay),
      oneWeekAggregate: getAggregatedIssuesForSnapshot(props.snapshot, analysisWindows.oneWeek)
    };
  },
  React.createClass({
    displayName: 'HealthIndicator',

    mixins: [
      React.addons.PureRenderMixin,
      SubscriptionMixin
    ],

    propTypes: {
      snapshot: irpt.map.isRequired,
      className: rpt.string,
      currentHealth: rpt.string,
      oneDayAggregate: rpt.object,
      oneWeekAggregate: rpt.object
    },

    componentDidMount() {
    },

    componentDidUpdate() {
      const dayProgress = this.getProgress(this.props.oneDayAggregate);
      this.drawArc({ canvasName: 'canvas', radius: 12, to: 2, color: '#72838a' });
      this.drawArc({ canvasName: 'canvas', radius: 12, to: dayProgress, color: theme.health[dayProgress * 10 | 0] });

      const weekProgress = this.getProgress(this.props.oneWeekAggregate);
      this.drawArc({ canvasName: 'canvas', radius: 20, to: 2, color: '#72838a' });
      this.drawArc({ canvasName: 'canvas', radius: 20, to: weekProgress, color: theme.health[weekProgress * 10 | 0] });
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
          <canvas ref='canvas'
                  width='50px'
                  height='50px'
                  className={block + '__canvas'}/>

          <div className={block + '__inner-circle'}
               style={{ backgroundColor: this.calculateColorForHealth(this.props.currentHealth) }}/>
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

    getProgress(aggregate) {
      return aggregate.diminishedSeverity / 10;
    }
  }
));
