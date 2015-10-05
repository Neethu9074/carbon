

import Immutable from 'immutable';
import React from 'react/addons';
import moment from 'moment';
import irpt from 'react-immutable-proptypes';

import {getProblemsForSnapshot} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {mapSeverityToHealth, health} from 'in-services/health';
import {theme} from 'in-services/theme';

import Collapsible from '../Collapsible';

import './ProblemPanel.less';

const block = 'in-detail-panel';

const ProblemPanel = React.createClass({
  mixins: [SubscriptionMixin, React.addons.PureRenderMixin],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  getInitialState() {
    return {
      problems: Immutable.List()
    };
  },

  componentWillMount() {
    this.subscribeToProblems(this.props);
  },

  subscribeToProblems(props) {
    this.addSubscription(
      getProblemsForSnapshot(props.snapshot)
        .subscribe(problems => this.setState({problems}))
    );
  },

  componentWillReceiveProps(nextProps) {
    this.disposeSubscriptions();

    // reset problems of previous snapshot
    this.setState({
      problems: Immutable.List()
    });

    this.subscribeToProblems(nextProps);
  },

  render() {
    if (this.state.problems.size === 0) {
      return null;
    }

    const orderedProblems = this.state.problems
      .sortBy(problem => problem.get('severity'))
      .reverse();

    const maxColor = this.getColor(orderedProblems.first());

    return (
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header style={{color: maxColor}}>
          {'Problems (' + this.state.problems.size + ')'}
        </Collapsible.Header>
        <Collapsible.Content>
          <ul className={block + '__problems'}>
            {orderedProblems.map(problem =>
              <li key={problem.get('id')}
                  className={block + '__problem'}>
                <h3 className={block + '__problem-text'}
                    style={{color: this.getColor(problem)}}>
                  {problem.get('problemText')}

                  <span className={block + '__problem-start'}>
                    {moment(problem.get('start')).fromNow()}
                  </span>
                </h3>
              </li>
            ).toJS()}
          </ul>
        </Collapsible.Content>
      </Collapsible>
    );
  },

  getColor(problem) {
    switch (mapSeverityToHealth(problem.get('severity'))) {
      case health.ok:
        return theme.health[0];
      case health.warning:
        return theme.health[5];
      case health.danger:
        return theme.health[10];
      default:
        throw new Error('Unknown health ' + mapSeverityToHealth(problem));
    }
  }
});

export default ProblemPanel;
