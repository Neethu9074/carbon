import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getSingular} from 'in-sdk/pluginName';
import getSnapshot from 'in-hoc/getSnapshot';
import {getIcon} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip';

import './Tab.less';

const block = 'in-sidebar-tab';
const rpt = React.PropTypes;

export default getSnapshot(React.createClass({
  displayName: 'SidebarTab',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    snapshot: irpt.map,
    isSelected: rpt.bool.isRequired,
    onClick: rpt.func.isRequired,
    className: rpt.string
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    let className = this.props.isSelected ? block + ' ' + block + '__selected' : block;
    className += ' ' + this.props.className;

    return (
      <Tooltip content={getSingular(snapshot.get('plugin'))}>
        <li className={className}
            onClick={() => this.props.onClick(this.props.snapshotId)}>

          <img src={getIcon(snapshot)}
               alt='Snapshot icon'
               className={block + '__icon'}/>
        </li>
      </Tooltip>
    );
  }
}));
