import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getSingular} from 'in-sdk/pluginName';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel, getIcon} from 'in-sdk/snapshot';

import Tooltip from 'in-components/Tooltip';

import './Tab.less';

const block = 'in-sidebar-tab';
const rpt = React.PropTypes;

export default getSnapshot(React.createClass({
  displayName: 'SidebarTab',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    isSelected: rpt.bool.isRequired,
    onClick: rpt.func.isRequired,
    className: rpt.string,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    let className = this.props.isSelected ? block + ' ' + block + '__selected' : block;
    className += ' ' + this.props.className;

    const tooltip = `${getSingular(snapshot.get('plugin'))}: ${getLabel(snapshot)}`;

    return (
      <Tooltip content={tooltip}
               align={{
                 vertical: 'middle',
                 horizontal: 'right'
               }}>
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
