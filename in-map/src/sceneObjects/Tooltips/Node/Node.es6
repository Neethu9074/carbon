import Immutable from 'immutable';
import React from 'react/addons';
import moment from 'moment';

import {getProblemsForSnapshot, getColorForProblem} from 'in-services/issueTracker';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import IssueStatusLine from 'in-components/Tooltips/StatusLine';
import {getSingular, getPlural} from 'in-sdk/pluginName';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import {getHealth} from 'in-services/issueTracker';
import {health} from 'in-services/health';
import {getLabel} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip';

import './Node.less';

const block = 'in-tooltip__node';

const NodeTooltipRC = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    snapshot: React.PropTypes.object.isRequired,
    layer: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {health: health.ok, issues: Immutable.List()};
  },

  componentDidMount() {
    this.addSubscription(getHealth(this.props.snapshot)
      .subscribe(h => this.setState({health: h})));

    this.addSubscription(getProblemsForSnapshot(this.props.snapshot)
      .subscribe(issues => this.setState({issues})));
  },

  getStatusLine() {
    const state = this.state;
    const nodeHealth = state.health;
    const snapshot = this.props.snapshot;
    const issues = state.issues
      .sortBy(problem => problem.get('severity'))
      .reverse();
    const data = snapshot.get('data');

    //only show the status line if there is a "bad" health or some issues
    if (nodeHealth !== health.ok && this.issuesAvailable()) {
        try {
          return (<IssueStatusLine
            left={getLabel(snapshot)}
            right={moment(issues.get(0).get('start')).fromNow()}/>);
        } catch (err) {
          return <IssueStatusLine left={data.get('hostname')} />;
        }
    }
    return null;
  },

  getHeading() {
    const snapshot = this.props.snapshot;

    let text = getSingular(snapshot.get('pluginId')) + ': ' + getLabel(snapshot);
    const style = {};

    if (this.issuesAvailable()) {
      const mostImportantProblem = this.state.issues.reduce((issueA, issueB) => {
        if (issueA.getIn(['problem', 'severity']) >= issueB.getIn(['problem', 'severity'])) {
          return issueA;
        }
        return issueB;
      });
      text = mostImportantProblem.get('problemText');
      style.color = getColorForProblem(mostImportantProblem);
    }

    return {text, style};
  },

  issuesAvailable() {
    return this.state.issues.some(problem => problem.get('severity') > 0);
  },

  getContent() {
    let content = <Content>{this.props.snapshot.get('hostId')}</Content>;
    const layer = this.props.layer;

    if (this.issuesAvailable()) {
      const suggestion = this.state.issues.getIn([0, 'fixSuggestion']);
      if (suggestion) {
        content = <Content>{suggestion}</Content>;
      }

    } else if (layer.length > 0) {
      const plugins = {}; // maps type -> counter
      layer.forEach(item => {
        if(!item.snapshot) {
          return;
        }
        const pluginId = item.snapshot.get('pluginId');
        if(!plugins[pluginId]) {
          plugins[pluginId] = 0;
        }
        plugins[pluginId]++;
      });

      const listItems = Object.keys(plugins).sort().map(plugin => {
        const counter = plugins[plugin];
        return (
          <li key={plugin} className={block + '__li'}>
            <div className={block + '__li-wrapper'}>
              <Heading className={block + '__li-header'}>
                {counter}
              </Heading>
              <Content className={block + '__li-content'}>
                {counter > 1 ?
                  getPlural(plugin) :
                  getSingular(plugin)
                }
              </Content>
            </div>
          </li>
        );
      });

      content = <ul className={block + '__ul'}> {listItems} </ul>;
    }
    return content;
  },

  render() {
    if (!this.props.snapshot) {
      return null;
    }

    const heading = this.getHeading();
    const content = this.getContent();

    return (
      <TooltipFrame>
        {this.issuesAvailable() ?
        this.getStatusLine() :
        null}
        <Heading style={heading.style}>
          {heading.text}
        </Heading>
        {content}
      </TooltipFrame>
    );
  }
});

export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super(parent);
  }

  render() {
    React.render(
      <NodeTooltipRC
        snapshot={this.parent.snapshot}
        layer={this.parent.getComponent('layer').layer}
      />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
