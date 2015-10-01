import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getProblemsForSnapshot} from 'in-services/issueTracker';
import {getClassName} from 'in-services/react';

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
    size: rpt.number.isRequired,
    className: rpt.string
  },

  getInitialState() {
    return { maxSeverity: 0 };
  },

  componentDidMount() {
    this.addSubscription(getProblemsForSnapshot(this.props.snapshot).map(problems => {
      return problems.reduce((acc, problem) => {
        return Math.max(problem.get('severity'), acc);
      }, 0);
    }).subscribe(maxSeverity => {
      this.setState({ maxSeverity });
    }));
  },

  render() {
    const width = this.props.size ? this.props.size : 100;
    const progress = this.state.maxSeverity / 10;

    return (
      <div className={getClassName(this, block)}
           style={{width}}>
        <div className={block + '__progress'}
             style={{width: width * progress}}/>
      </div>
    );
  }
});

export default HealthIndicator;
