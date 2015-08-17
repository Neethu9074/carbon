import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import classnames from 'in-services/util/classnames';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';

import Controls from './Controls';
import enhance from '../hoc/enhance';

import './Sidebar.less';

const rpt = React.PropTypes;
const block = 'in-sidebar';

const Sidebar = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    pluginIds: rpt.arrayOf(rpt.string).isRequired,
    snapshots: irpt.list
  },

  getInitialState() {
    return {
      activeControl: null,
      activeHealthFilter: null
    };
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
        <Controls className={classnames({
                    [block + '__controls']: true,
                    [block + '__controls--open']: !!this.state.activeControl
                  })}
                  activeControl={this.state.activeControl}
                  onChangeActiveControl={this.onChangeActiveControl} />
        <div className={classnames({
          [block + '__content']: true,
          [block + '__content--open']: !!this.state.activeControl
        })}>

        </div>
      </div>
    );
  },

  onChangeActiveControl(activeControl) {
    this.setState({
      // close when it is already active
      activeControl: activeControl === this.state.activeControl ? null : activeControl
    });
  }

});

export default enhance(Sidebar);
