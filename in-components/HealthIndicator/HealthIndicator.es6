import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import moment from 'moment';

import {
  getHealth,
  getAggregatedIssuesForSnapshot,
  analysisWindows
} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getServerTime} from 'in-services/time';
import {health} from 'in-services/health';
import {theme} from 'in-services/theme';

import Tooltip from '../Tooltip';
import connectTo from '../hoc/connectTo';

const rpt = React.PropTypes;
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
      currentHealth: rpt.string,
      oneDayAggregate: rpt.object,
      oneWeekAggregate: rpt.object
    },

    componentDidMount() {
      this.renderCanvasContent();
    },

    componentDidUpdate() {
      this.renderCanvasContent();
    },

    renderCanvasContent() {
      if (!this.props.oneDayAggregate || !this.props.oneWeekAggregate) {
        return;
      }
      const ctx = this.refs.canvas.getDOMNode().getContext('2d');

      const dayProgress = this.getProgress(this.props.oneDayAggregate);
      this.drawArc(ctx, 2, '#72838a', 6);
      this.drawArc(ctx, dayProgress, theme.health[dayProgress * 10 | 0], 6);

      const weekProgress = this.getProgress(this.props.oneWeekAggregate);
      this.drawArc(ctx, 2, '#72838a', 11);
      this.drawArc(ctx, weekProgress, theme.health[weekProgress * 10 | 0], 11);

      const currentHealthColor = this.calculateColorForHealth(this.props.currentHealth);
      ctx.beginPath();
      ctx.arc(18, 18, 2, 0, 2 * Math.PI);
      ctx.lineWidth = 0;
      ctx.fillStyle = currentHealthColor;
      ctx.fill();
      ctx.closePath();
    },

    drawArc(ctx, to, color, radius) {
      ctx.beginPath();
      ctx.arc(18, 18, radius, offset, offset + to * progToDeg);
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
    },

    render() {
      return (
        <Tooltip content={this.getTooltipContent()}>
          <canvas ref='canvas'
                  width='36px'
                  height='36px'/>
        </Tooltip>
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
    },

    getTooltipContent() {
      if (!this.props.oneDayAggregate || !this.props.oneWeekAggregate) {
        return '';
      }

      let tooltip = '';

      const weeklySummary = this.getLabelForAggregate(this.props.oneWeekAggregate);
      const dailySummary = this.getLabelForAggregate(this.props.oneDayAggregate);

      if (weeklySummary && weeklySummary === dailySummary) {
        return 'Summary: ' + weeklySummary;
      }

      if (weeklySummary) {
        tooltip += 'Weekly summary: ' + weeklySummary;
      }

      if (dailySummary) {
        if (tooltip.length > 0) {
          tooltip += ' ';
        }
        tooltip += 'Daily summary: ' + dailySummary;
      }

      if (tooltip === '') {
        return 'There haven\'t been any issues lately.';
      }
      return tooltip;
    },

    getLabelForAggregate(aggregate) {
      if (this.props.oneWeekAggregate.diminishedSeverity < 1) {
        return null;
      } else if (!aggregate.problemEndTime) {
        return 'An unresolved issue with severity ' + aggregate.severity + ' exists.';
      }
      const timeAgo = moment(aggregate.problemEndTime).from(getServerTime());
      return 'An issue with severity ' + aggregate.severity + ' existed ' + timeAgo + '.';
    }
  }
));
