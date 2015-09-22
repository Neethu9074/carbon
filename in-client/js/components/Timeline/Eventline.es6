import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';
import {getFullSnapshot, extractCoordinates} from 'in-services/snapshots';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getCurrentScaleProperties} from 'in-services/time';
import {focusedMoment} from 'in-services/stores/timeline';
import {getIssues} from 'in-services/issueTracker';
import enhance from 'in-components/hoc/enhance';

import IssueLine from './IssueLine';
import Issue from './Issue';

import './Eventline.less';

const rpt = React.PropTypes;
const block = 'in-timeline-eventline';

const Eventline = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    focusedMoment: rpt.number,
    openIssues: irpt.list
  },

  statics: {
    createObservables() {
      return {
        openIssues: getIssues().debounce(500),
        focusedMoment
      };
    }
  },

  getInitialState() {
    return {
      renderedForTimestamp: Date.now(),
      hoveredSnapshot: null,
      hoveredIssue: null
    };
  },

  componentWillMount() {
    // force a redraw of this component every few seconds to animate the timeline
    this.interval = setInterval(() => {
      this.setState({
        renderedForTimestamp: Date.now()
      });
    }, 1000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render() {
    return (
      <div className={block}>
        {this.renderIssueLine()}
        {this.renderIssues()}
        {this.renderFocusedMoment()}
      </div>
    );
  },

  renderIssueLine() {
    const issue = this.state.hoveredIssue;
    if (!issue) {
      return null;
    }

    const scale = getCurrentScaleProperties().scale;

    return (<IssueLine style={{left: scale(issue.get('start')).toFixed(2) + '%'}}
                       issue={issue}/>);
  },

  renderIssues() {
    const openIssues = this.props.openIssues;
    if (!openIssues || openIssues.size === 0) {
      return null;
    }

    const scaleProps = getCurrentScaleProperties();
    const scale = scaleProps.scale;
    return openIssues
      .filter(issue => issue.get('start') > scaleProps.maxOldestPermittedIssue)
      .map(issue => <Issue key={issue.get('id')}
                                      mouseIn={this.mouseIn}
                                      mouseOut={this.mouseOut}
                                      issue={issue}
                                      style={{ left: scale(issue.get('start')).toFixed(2) + '%' }}/>
      );
  },

  mouseIn(issue) {
    this.setState({
      hoveredIssue: issue,
      tooltipX: event.pageX,
      tooltipY: -10
    });
    const problem = issue.get('problem');
    const problemCoordinates = extractCoordinates(problem);
    this.addSubscription(
      getFullSnapshot(problemCoordinates)
      .subscribe(hoveredSnapshot => this.setState({hoveredSnapshot}))
    );
    highlightedSnapshotStore.select(problemCoordinates);
  },

  mouseOut() {
    this.setState({
      hoveredIssue: null,
      hoveredSnapshot: null,
      tooltipX: -1,
      tooltipY: -1
    });
    this.disposeSubscriptions();
    highlightedSnapshotStore.clear();
  },

  renderFocusedMoment() {
    if (!this.props.focusedMoment) {
      return null;
    }

    const scale = getCurrentScaleProperties().scale;
    return (
      <div className={block + '__focused-moment'}
           style={{ left: scale(this.props.focusedMoment).toFixed(2) + '%' }}/>
    );
  }
});

export default enhance(Eventline);
