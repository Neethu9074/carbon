import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import getSnapshot from 'in-hoc/getSnapshot';
import {getIcon, getLabel} from 'in-sdk/snapshot';
import Tooltip from 'in-components/Tooltip';

import './Crumb.less';

const block = 'in-crumb';

export default getSnapshot(
               React.createClass({

  displayName: 'Crumb',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    selectedSnapshotId: React.PropTypes.string.isRequired,
    snapshotId: React.PropTypes.string.isRequired,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const isSelected = this.props.snapshotId === this.props.selectedSnapshotId;
    const label = getSingular(snapshot.get('plugin'));
    const className = isSelected ? block + ' ' + block + '__selected' : block;
    const icon = getIcon(snapshot);

    const tooltip = `${getSingular(snapshot.get('plugin'))}: ${getLabel(snapshot)}`;

    return (
      <Tooltip content={tooltip}>
        <li className={className}
            onClick={this.onCrumbClicked}>

          <img src={icon}
               alt='Snapshot icon'
               className={block + '__icon'}/>
          {label}
        </li>
      </Tooltip>
    );
  },

  onCrumbClicked() {
    setSelectedSnapshotId(this.props.snapshotId);
  }
}));
