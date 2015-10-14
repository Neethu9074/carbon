import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getFullSnapshot} from 'in-services/snapshots';
import {getSingular} from 'in-sdk/pluginName';
import {getIcon} from 'in-sdk/snapshot';

import enhance from '../hoc/enhance';

import './Crumb.less';

const block = 'in-crumb';

const alwaysEmptyArrayObservable = ro.create({emitLatestOnSubscribe: true});
alwaysEmptyArrayObservable.emit([]);

const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);

const Crumb = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    selectedSnapshot: irpt.map.isRequired,
    coordinates: irpt.map.isRequired,
    fullSnapshot: irpt.map
  },

  statics: {
    createObservables(props) {
      return {
        selectedSnapshot: selectedSnapshotStore.selectedSnapshot,
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
    const coordinates = this.props.coordinates;
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(coordinates.get('pluginId')),
        steadyId: encodeURIComponent(coordinates.get('steadyId')),
        hostId: encodeURIComponent(coordinates.get('hostId'))
      }
    );
  }
});

export default enhance(Crumb);
