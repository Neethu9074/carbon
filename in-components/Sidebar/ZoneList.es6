import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getColor} from 'in-sdk/zones';
import {getZone} from 'in-sdk/zones';
import * as viewStore from 'in-services/stores/view';

import enhance from '../hoc/enhance';
import Collapsible from '../Collapsible';
import SnapshotList from './SnapshotList';

import './ZoneList.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-zone-list';

const ZoneList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    highlightedSnapshot: irpt.map,
    snapshotsWiredToHighlightedSnapshot: irpt.map.isRequired,

    groups: rpt.object
  },

  statics: {
    createObservables() {
      const groups = viewStore.viewStructure.map(viewStructure => {
        const grouppedNodes = {};

        viewStructure.forEach(nodeStructure => {
          let zone;
          if (nodeStructure.group) {
            zone = getZone(nodeStructure.group);
          } else {
            zone = 'undefined';
          }

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
        groups
      };
    }
  },

  render() {
    const groups = Object.keys(this.props.groups).sort();
    return (
      <div className={block}>
        <h1 className={block + '__label'}>Zones</h1>
        {groups.map(group =>
          <Collapsible key={group}>
            <Collapsible.Header style={{color: getColor(group)}}
                                className={block + '__zone'}>
              <span className={block + '__server-count'}
                    style={{backgroundColor: getColor(group)}}>
                {this.props.groups[group].length}
              </span>

              {group}
            </Collapsible.Header>

            <Collapsible.Content>
              <SnapshotList snapshots={this.props.groups[group].map(n => n.node)}
                            snapshotsWiredToHighlightedSnapshot={this.props.snapshotsWiredToHighlightedSnapshot}
                            highlightedSnapshot={this.props.highlightedSnapshot}/>
            </Collapsible.Content>
          </Collapsible>
        )}
      </div>
    );
  }
});

export default enhance(ZoneList);
