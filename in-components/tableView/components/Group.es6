import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Entity from 'in-components/tableView/components/Entity';
import {getColorPool} from 'in-services/util/ColorGenerator';
import CheckBox from 'in-components/CheckBox';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';
import Icon from 'in-components/Icon';

import './Group.less';


const block = 'in-table-view-group';
const rpt = React.PropTypes;

export default getSnapshot(
  React.createClass({

    displayName: 'Group',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      snapshotId: rpt.string.isRequired,
      hosts: irpt.list.isRequired,
      snapshot: irpt.map
    },

    getInitialState() {
      return {
        isCollapsed: true,
        isChecked: false
      };
    },

    render() {
      const snapshot = this.props.snapshot;
      const hosts = this.props.hosts;
      const color = getColorPool('groups').getColorHex(this.props.snapshotId);

      return (
        <div className={block}>
          <div className={block + '__header'}>

            <CheckBox onClick={() => this.setState({isChecked: !this.state.isChecked})}
                      defaultChecked={false} />

            <Icon className={block + '__arrow-icon'}
                  type={this.state.isCollapsed ? 'open' : 'close'}
                  onClick={() => this.setState({isCollapsed: !this.state.isCollapsed})} />

            {snapshot ?
              <span style={{color}}>
                {getLabel(snapshot)}
              </span>
              : null
            }
            <span className={block + '__counter'}>
              {'(' + hosts.size + ')'}
            </span>

          </div>

          {this.state.isCollapsed ?
            null :
            hosts.map(host =>
              <Entity key={host.get('id')}
                      snapshotId={host.get('id')}
                      entity={host} />
            )
          }
        </div>
      );
    }
  })
);
