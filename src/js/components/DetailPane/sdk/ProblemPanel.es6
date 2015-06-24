'use strict';

import Immutable from 'immutable';
import React from 'react/addons';
import moment from 'moment';

import {getProblemsForSnapshot} from 'instana-ui-services/issueTracker';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {mapSeverityToHealth, health} from 'instana-ui-services/health';
import {theme} from 'instana-ui-services/theme';

import Panel from './Panel';

import './ProblemPanel.less';

const block = 'in-detail-panel';

const ProblemPanel = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  getInitialState() {
    return {
      problems: Immutable.List()
    };
  },

  componentDidMount() {
    this.subscribeToProblems();
  },

  subscribeToProblems() {
    this.addSubscription(
      getProblemsForSnapshot(this.props.snapshot)
        .subscribe(problems => this.setState({problems}))
    );
  },

  componentWillReceiveProps() {
    this.disposeSubscriptions();

    // reset problems of previous snapshot
    this.setState({
      problems: Immutable.List()
    });

    this.subscribeToProblems();
  },

  render() {
    if (this.state.problems.size === 0) {
      return null;
    }

    return (
      <Panel title={'Problems (' + this.state.problems.size + ')'}>
        <ul className={block + '__problems'}>
          {this.state.problems.map(problem =>
            <li key={problem.get('id')}>
              <h3 className={block + '__problem-text'}
                  style={{color: this.getColor(problem)}}>
                {problem.get('problemText')}

                <span className={block + '__problem-start'}>
                  {moment(problem.get('start')).fromNow()}
                </span>
              </h3>
              <p className={block + '__problem-fix-suggestion'}>
                {problem.get('fixSuggestion')}
              </p>
            </li>
          ).toJS()}
        </ul>
      </Panel>
    );
  },

  getColor(problem) {
    switch (mapSeverityToHealth(problem.get('severity'))) {
      case health.ok:
        return '#fff';
      case health.warning:
        return theme.health.warning;
      case health.danger:
        return theme.health.danger;
      default:
        throw new Error('Unknown health ' + mapSeverityToHealth(problem));
    }
  }
});

export default ProblemPanel;
