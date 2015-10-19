import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getFullSnapshot} from 'in-services/snapshots';
import {getSingular} from 'in-sdk/pluginName';
import {getIcon} from 'in-sdk/snapshot';

import enhance from '../hoc/enhance';

import './Crumb.less';

const block = 'in-crumb';

const Crumb = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    selectedSnapshot: irpt.map.isRequired,
    coordinates: irpt.map.isRequired,
    fullSnapshot: irpt.map
  },

  statics: {
    createObservables(props) {
      return {
        fullSnapshot: getFullSnapshot(props.coordinates)
      };
    }
  },

  render() {
    const coordinates = this.props.coordinates;
    const isSelected = coordinates.get('id') === this.props.selectedSnapshot.get('id');
    const label = getSingular(coordinates.get('pluginId'));
    const className = isSelected ? block + ' ' + block + '__selected' : block;
    const icon = this.props.fullSnapshot ? getIcon(this.props.fullSnapshot) : getIcon(coordinates);

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
    selectedSnapshotStore.select(this.props.coordinates);
  }
});

export default enhance(Crumb);
