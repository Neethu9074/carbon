import Immutable from 'immutable';
import React from 'react/addons';

import IssueDiscription from 'in-components/IssueDiscription';
import SnapshotMixin from 'in-services/util/SnapshotMixin';
import Tooltip from 'in-components/Tooltip';
import {health} from 'in-services/health';
import Icon from 'in-components/Icon';
import theme from 'in-services/theme';

import StickyNote from '../StickyNote';

import './PhysicalGroup.less';

const rpt = React.PropTypes;
const block = 'in-sticky-note-group';

const PhysicalGroup = React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SnapshotMixin
  ],

  propTypes: {
    onMouseLeave: rpt.func.isRequired,
    onMouseEnter: rpt.func.isRequired,
    isActive: rpt.bool.isRequired,
    onClick: rpt.func.isRequired,
    color: rpt.object.isRequired,
    id: rpt.string.isRequired
  },

  getInitialState() {
    return {
      health: health.ok,
      issues: Immutable.List()
    };
  },

  componentDidMount() {
    // TODO: get health and problems by ID
    // this.addSubscription(getHealth(snapshot).subscribe(newHealth => this.setState({ health: newHealth })));
    // this.addSubscription(getProblemsForSnapshot(snapshot).subscribe(issues => this.setState({issues})));
  },

  render() {
    const c = this.props.color;
    const backgroundColor = this.props.isActive ?
      '#fff' :
      'rgb(' + ((c.r * 255) | 0) + ',' + ((c.g * 255) | 0) + ',' + ((c.b * 255) | 0) + ')';

    const label = this.state.snapshot.getIn(['data', 'groupId']) || this.props.id;

    return (
      <div className={block + '__wrapper'}>
        <div className={block + '__content'}
             style={{backgroundColor}}
             onClick={this.props.onClick}
             onMouseEnter={this.props.onMouseEnter}
             onMouseLeave={this.props.onMouseLeave}>
          {label}
        </div>
        {this.getHealthIcon()}
      </div>
    );
  },

  getHealthIcon() {
    const icon = this.getIcon(this.state.health);
    if (!icon) {
      return null;
    }

    if (this.issuesAvailable()) {
      const mostImportantIssue = this.state.issues.reduce((issueA, issueB) => {
        if (issueA.getIn(['problem', 'severity']) >= issueB.getIn(['problem', 'severity'])) {
          return issueA;
        }
        return issueB;
      });

      return (
        <Tooltip align={{horizontal: 'right'}}
                 content={<IssueDiscription issue={mostImportantIssue}/>}>
          {icon}
        </Tooltip>
      );
    }

    return icon;
  },

  issuesAvailable() {
    return this.state.issues.some(problem => problem.get('severity') > 0);
  },

  getIcon(groupHealth) {
    if (groupHealth === health.danger) {
      return <Icon type={'critical'} style={{ color: theme.map.colors.critical }}/>;
    } else if (groupHealth === health.warning) {
      return <Icon type={'warning'} style={{ color: theme.map.colors.warning }}/>;
    }
    return null;
  }
});


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});

    this.setActive(false);
  }

  render() {
    const parent = this.parent;

    React.render(
      <PhysicalGroup id={parent.id}
                     isActive={this.isActive}
                     color={parent.getColor()}
                     onClick={parent.onGroupClicked.bind(parent)}
                     onMouseEnter={() => parent.highlight()}
                     onMouseLeave={() => parent.highlight(false)}/>,
      this.stickyNoteContainer
    );
  }

  setActive(isActive = true) {
    this.isActive = isActive;
    this.render();
  }
}
