import React from 'react';
import irpt from 'react-immutable-proptypes';
import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import classnames from 'in-services/util/classnames';
import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {create} from 'in-services/conveyer';

import Tags from './Tags';
import ZoneList from './ZoneList';
import Controls from './Controls';
import MapStats from './MapStats';
import Metrics from './Metrics';
import enhance from '../hoc/enhance';

import './Sidebar.less';

const rpt = React.PropTypes;
const block = 'in-sidebar';

const Sidebar = React.createClass({
  propTypes: {
    pluginIds: rpt.arrayOf(rpt.string).isRequired,
    snapshots: irpt.list,
    selectedSnapshot: irpt.map,
    highlightedSnapshot: irpt.map,
    snapshotsWiredToHighlightedSnapshot: irpt.map
  },

  getInitialState() {
    return {
      activeControl: null
    };
  },

  shouldComponentUpdate(newProps, newState) {
    return this.props.snapshots !== newProps.snapshots ||
      this.state.activeControl !== newState.activeControl;
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
        snapshots: singleSnapshotSource,
        selectedSnapshot: selectedSnapshotStore.selectedSnapshot,
        highlightedSnapshot: highlightedSnapshotStore.highlightedSnapshot,
        snapshotsWiredToHighlightedSnapshot: highlightedSnapshotStore.wiredSnapshots
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
          {this.renderContent()}
        </div>
      </div>
    );
  },

  renderContent() {
    if (!this.state.activeControl) {
      return null;
    }

    if (__DEV__ && this.state.activeControl === 'mapStats') {
      return <MapStats />;
    }

    switch (this.state.activeControl) {
      case 'tags':
        return <Tags snapshots={this.props.snapshots} />;
      case 'snapshotList':
        return (
          <ZoneList snapshots={this.props.snapshots}
                    snapshotsWiredToHighlightedSnapshot={this.props.snapshotsWiredToHighlightedSnapshot}
                    selectedSnapshot={this.props.selectedSnapshot}
                    highlightedSnapshot={this.props.highlightedSnapshot}
                    closeSidebar={this.closeSidebar}/>
        );
      case 'metrics':
        return <Metrics />;
      default:
        throw new Error('Unknown content control', this.state.activeControl);
    }
  },

  onChangeActiveControl(activeControl) {
    this.setState({
      // close when it is already active
      activeControl: activeControl === this.state.activeControl ? null : activeControl
    });
  },

  closeSidebar() {
    this.setState({
      activeControl: null
    });
  }

});

export default enhance(Sidebar);
