import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {setSelectedSnapshotId} from 'in-stores/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';
import {getSingular} from 'in-sdk/pluginName';
import {getIcon} from 'in-sdk/snapshot';

import './Crumb.less';

const block = 'in-crumb';

export default getSnapshot(React.createClass({
  displayName: 'Crumb',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    selectedSnapshotId: React.PropTypes.string.isRequired,
    snapshotId: React.PropTypes.string.isRequired,
    snapshot: irpt.map
  },

  render() {
    if (!this.props.snapshot) {
      return null;
    }

    const isSelected = this.props.snapshotId === this.props.selectedSnapshotId;
    const label = getSingular(this.props.snapshot.get('plugin'));
    const className = isSelected ? block + ' ' + block + '__selected' : block;
    const icon = getIcon(this.props.snapshot);

    return (
      <li className={className}
          onClick={this.onCrumbClicked}>

        <img src={icon}
             alt='Snapshot icon'
             className={block + '__icon'}/>
        {label}
      </li>
    );
  },

  onCrumbClicked() {
    setSelectedSnapshotId(this.props.snapshotId);
  }
}));
