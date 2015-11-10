import React from 'react/addons';

import {nameOfUndefinedZone} from 'in-forge/constants';
import * as viewStore from 'in-services/stores/view';
import {getLabel} from 'in-sdk/snapshot';
import views from 'in-services/views';
import {getColor} from 'in-services/util/groupColors';

import SnapshotList from './SnapshotList';
import Collapsible from '../Collapsible';
import ListHeader from './ListHeader';
import enhance from '../hoc/enhance';

import './ZoneList.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-zone-list';

const ZoneList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    activeView: rpt.string,
    groups: rpt.object
  },

  statics: {
    createObservables() {
      const groups = viewStore.viewStructure.map(viewStructure => {
        const grouppedNodes = {};

        viewStructure.forEach(nodeStructure => {
          const zone = getLabel(nodeStructure.group) || nameOfUndefinedZone;
          if (zone in grouppedNodes) {
            grouppedNodes[zone].push(nodeStructure);
          } else {
            grouppedNodes[zone] = [nodeStructure];
          }
        });

        return grouppedNodes;
      });

      return {
        viewStructure: viewStore.viewStructure,
        activeView: viewStore.view,
        groups
      };
    }
  },

  getInitialState() {
    return { sortedBy: 'zone' };
  },

  render() {
    const groups = this.props.groups;
    if (!groups) {
      return null;
    }

    return (
      <div className={block}>

        <ListHeader header={this.getHeaderForView()}/>
        <div className={block + '__spacer'}/>

        {this.state.sortedBy === 'zone' ?
          this.showAsZoneList(groups) : this.showAsHealthList(groups)}
      </div>
    );
  },

  getHeaderForView() {
    const activeView = this.props.activeView;
    if (activeView === views.physical) {
      return 'Hosts';
    } else if (activeView === views.process) {
      return 'Processes';
    }
    return '';
  },

  showAsZoneList(groups) {
    const groupNames = Object.keys(groups).sort();
    const className = block + '__collapsible';
    return (
      <div>
        {groupNames.map(group =>
          <Collapsible key={group}
                       className={className}>
            <Collapsible.Header style={{color: getColor(group)}}
                                className={className}>
              {group + ' (' + groups[group].length + ')'}
            </Collapsible.Header>

            <Collapsible.Content>
              <SnapshotList snapshots={groups[group].map(n => n.node)}/>
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  },

  showAsHealthList(groups) {
    const groupNames = Object.keys(groups);
    const nodes = [];
    groupNames.forEach(group => {
      groups[group].forEach(n => nodes.push(n.node));
    });

    return <SnapshotList snapshots={nodes}/>;
  },

  onSortingChanged(event) {
    this.setState({ sortedBy: event.target.value });
  }
});

export default enhance(ZoneList);
