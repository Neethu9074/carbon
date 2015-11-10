import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getProblemsForSnapshot} from 'in-services/issueTracker';
import {getClassName} from 'in-services/react';
import {theme} from 'in-services/theme';

import './HealthIndicator.less';

const rpt = React.PropTypes;
const block = 'in-healthindicator';

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
    return { sumSeverities: 0 };
  },

  componentDidMount() {
    this.addSubscription(getProblemsForSnapshot(this.props.snapshot).map(problems => {
      // sum all severities
      return problems.reduce((acc, problem) => {
        const severity = problem.get('severity');
        return acc + severity;
      }, 0);
    }).subscribe(sumSeverities => this.setState({ sumSeverities })));
  },

  render() {
    const sum = this.state.sumSeverities;
    const progress = Math.min(10, sum); // [0, 10]

    return (
      <div className={getClassName(this, block)}>
        <div className={block + '__progress'}
             style={{
               width: progress * 10 + '%', // [0, 100]
               backgroundColor: theme.health[progress | 0]
             }}/>
      </div>
    );
  }
});

export default HealthIndicator;
