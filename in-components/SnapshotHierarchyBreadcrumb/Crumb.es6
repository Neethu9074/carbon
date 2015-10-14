import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {getSingular} from 'in-sdk/pluginName';
import {getIcon} from 'in-sdk/snapshot';

import enhance from '../hoc/enhance';

import './Crumb.less';

const block = 'in-crumb';

const alwaysEmptyArrayObservable = ro.create({emitLatestOnSubscribe: true});
alwaysEmptyArrayObservable.emit([]);

const Crumb = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    selectedSnapshot: irpt.map.isRequired,
    snapshot: irpt.map.isRequired
  },

  statics: {
    createObservables() {
      return { selectedSnapshot: selectedSnapshotStore.selectedSnapshot };
    }
  },

  render() {
    const snapshot = this.props.snapshot;
    const isSelected = snapshot.get('id') === this.props.selectedSnapshot.get('id');
    const label = getSingular(snapshot.get('pluginId'));
    const className = isSelected ? block + ' ' + block + '__selected' : block;

    return (
      <li className={className}
          onClick={this.onCrumbClicked}>

        <img src={getIcon(snapshot)}
             alt='Snapshot icon'
             className={block + '__icon'}/>
        {label}
      </li>
    );
  },

  onCrumbClicked() {
    const snapshot = this.props.snapshot;
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(snapshot.get('pluginId')),
        steadyId: encodeURIComponent(snapshot.get('steadyId')),
        hostId: encodeURIComponent(snapshot.get('hostId'))
      }
    );
  }
});

export default enhance(Crumb);
