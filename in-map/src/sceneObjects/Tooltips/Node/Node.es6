import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
import React from 'react/addons';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {getIssuesForSnapshot} from 'in-services/issueTracker';
import IssueDescription from 'in-components/IssueDescription';
import {getSingular, getPlural} from 'in-sdk/pluginName';
import TooltipFrame from 'in-components/Tooltips/Frame';
import {getLabel, getLongLabel} from 'in-sdk/snapshot';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';

import Tooltip from '../Tooltip';

import './Node.less';

const block = 'in-tooltip__node';

const NodeTooltipRC = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    layer: React.PropTypes.array.isRequired,
    snapshot: irpt.map.isRequired
  },

  getInitialState() {
    return {
      issues: Immutable.List()
    };
  },

  componentDidMount() {
    this.addSubscription(getIssuesForSnapshot(this.props.snapshot).subscribe(issues => this.setState({issues})));
  },

  getHeading() {
    const snapshot = this.props.snapshot;
    return (
      <Heading>
        {getSingular(snapshot.get('pluginId')) + ': ' + getLabel(snapshot)}
      </Heading>
    );
  },

  issuesAvailable() {
    return this.state.issues.some(issue => issue.getIn(['problem', 'severity']) > 0);
  },

  getMostImportantIssue() {
    return this.state.issues.reduce((issueA, issueB) => {
      if (issueA.getIn(['problem', 'severity']) >= issueB.getIn(['problem', 'severity'])) {
        return issueA;
      }
      return issueB;
    });
  },

  getContent() {
    const snapshot = this.props.snapshot;
    const snapshotLabel = getLongLabel(snapshot, snapshot.get('hostId'));
    let content = <Content>{snapshotLabel}</Content>;
    const layer = this.props.layer;

     if (layer.length > 0) {
      const plugins = {}; // maps type -> counter
      layer.forEach(item => {
        if (!item.snapshot) {
          return;
        }
        const pluginId = item.snapshot.get('pluginId');
        if (!plugins[pluginId]) {
          plugins[pluginId] = 0;
        }
        plugins[pluginId]++;
      });

      const listItems = Object.keys(plugins)
        .sort((a, b) => getSingular(a).localeCompare(getSingular(b)))
        .map(plugin => {
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
        }
      );

      content = <ul className={block + '__ul'}> {listItems} </ul>;
    }
    return content;
  },

  render() {
    if (!this.props.snapshot) {
      return null;
    }

    if (this.issuesAvailable()) {
      return (
        <TooltipFrame>
          <IssueDescription issue={this.getMostImportantIssue()}
                            plugin={this.props.snapshot.get('pluginId')}/>
        </TooltipFrame>
      );
    }

    return (
      <TooltipFrame>
        {this.getHeading()}
        {this.getContent()}
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
