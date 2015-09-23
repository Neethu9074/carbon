import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';

import SnapshotDetailContent from '../SnapshotDetailContent';
import enhance from '../hoc/enhance';
import Button from '../Button';

import './SnapshotDetailSidebar.less';

const block = 'in-snapshot-detail-sidebar';

const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);

const SnapshotDetailSidebar = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    parentCoordinates: irpt.map,
    snapshot: irpt.map
  },

  statics: {
    createObservables() {
      return {
        snapshot: selectedSnapshotStore.selectedSnapshot,
        parentCoordinates: selectedSnapshotStore.selectedSnapshot.transform({
          emitLatestOnSubscribe: true,

          transform(snapshot) {
            if (!snapshot) {
              return alwaysNullObservable;
            }
            return wiring.getParentNode(views.physical.hosts, snapshot);
          },

          shouldRetransform(prevSnapshot, snapshot) {
            return prevSnapshot !== snapshot;
          }
        })
      };
    }
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    return (
      <div className={block}>
        {this.renderNavigation()}
        <SnapshotDetailContent snapshot={snapshot}/>
      </div>
    );
  },

  renderNavigation() {
    if (this.props.parentCoordinates) {
      return (
        <div>
          <Button onClick={() => selectedSnapshotStore.select(this.props.parentCoordinates)}
                  className={block + '__close'}>
            back to host
          </Button>
        </div>
      );
    }
    return null;
  }
});

export default enhance(SnapshotDetailSidebar);
