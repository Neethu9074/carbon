import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';

import Controls from './Controls';
import enhance from '../hoc/enhance';

const rpt = React.PropTypes;
const block = 'in-sidebar';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    pluginIds: rpt.arrayOf(rpt.string).isRequired,
    snapshots: irpt.list
  },

  statics: {
    createObservables(props) {
      const snapshotSources = props.pluginIds.map(pluginId =>
        create(SnapshotConveyer, {pluginId})
      );

      // turn the list of snapshots list to a snapshot list, i.e.
      // flatten it the immutable way
      const singleSnapshotSource = combineLatest(snapshotSources)
        .map(snapshotLists => {
          const result = Immutable.List().asMutable();
          let i = 0;

          snapshotLists.forEach(snapshots => {
            snapshots.forEach(snapshot => {
              result.set(i++, snapshot);
            });
          });

          return result.asImmutable();
        });

      return {
        snapshots: singleSnapshotSource
      };
    }
  },

  render() {
    if (!this.props.snapshots) {
      return null;
    }
    return (
      <div className={block}>
        <Controls />
      </div>
    );
  }
});

export default enhance(Sidebar);
