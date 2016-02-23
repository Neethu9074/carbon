import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import IssueDescription from 'in-components/IssueDescription';
import {getColorPool} from 'in-services/util/ColorGenerator';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';
import Tooltip from 'in-components/Tooltip';
import {health} from 'in-services/health';
import Icon from 'in-components/Icon';
import theme from 'in-services/theme';
import {emptyList} from 'in-services/fixedImmutables';

import StickyNote from '../../StickyNote';

import './Group.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-group';

const PhysicalGroup = getSnapshot(React.createClass({

  displayName: 'physical group sticky',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    onMouseLeave: rpt.func.isRequired,
    onMouseEnter: rpt.func.isRequired,
    snapshotId: rpt.string.isRequired,
    isActive: rpt.bool.isRequired,
    onClick: rpt.func.isRequired,
    snapshot: irpt.map
  },

  getInitialState() {
    return {
      health: health.ok,
      issues: emptyList
    };
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const c = getColorPool('groups').getColorRGB(this.props.snapshotId);
    const backgroundColor = this.props.isActive ?
      '#fff' :
      'rgb(' + ((c.r * 255) | 0) + ',' + ((c.g * 255) | 0) + ',' + ((c.b * 255) | 0) + ')';

    const label = snapshot.getIn(['data', 'groupId']) || this.props.snapshotId;

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
                 content={<IssueDescription issue={mostImportantIssue}
                                            snapshotId={this.props.snapshotId}/>
                         }>
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
}));


export default class StickyNoteGroup extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});

    this.setActive(false);
  }

  render() {
    const parent = this.parent;
    const id = parent.id;

    React.render(
      <PhysicalGroup snapshotId={id}
                     isActive={this.isActive}
                     onClick={() => setSelectedSnapshotId(id)}
                     onMouseEnter={() => setHighlightedEntityId(id)}
                     onMouseLeave={() => clearHighlightedEntityId()}/>,
      this.stickyNoteContainer
    );
  }

  setActive(isActive = true) {
    this.isActive = isActive;
    this.render();
  }
}
