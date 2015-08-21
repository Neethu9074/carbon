import React from 'react';
import irpt from 'react-immutable-proptypes';
import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import classnames from 'in-services/util/classnames';
import * as highlightedSnapshotStore from 'in-services/stores/highlightedSnapshot';
import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import {isIdEqual} from 'in-services/util/snapshots';
import SnapshotsConveyer from 'in-services/conveyer/SnapshotsConveyer';
import {create} from 'in-services/conveyer';

import CloseSidebarButton from './CloseSidebarButton';
import Details from './Details';
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

  componentWillReceiveProps(newProps) {
    // automatically switch to the details view when a snapshot is selected
    if (!isIdEqual(this.props.selectedSnapshot, newProps.selectedSnapshot) &&
        newProps.selectedSnapshot != null) {
      this.setState({
        activeControl: 'details'
      });
    } else if (newProps.selectedSnapshot === null && this.state.activeControl === 'details') {
      this.setState({
        activeControl: null
      });
    }
  },

  statics: {
    createObservables(props) {
      const snapshotSources = props.pluginIds.map(pluginId =>
        create(SnapshotsConveyer, {pluginId})
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
    const open = !!this.state.activeControl;

    return (
      <div className={block}>
        <Controls className={classnames({
                    [block + '__controls']: true,
                    [block + '__controls--open']: open
                  })}
                  activeControl={this.state.activeControl}
                  onChangeActiveControl={this.onChangeActiveControl}
                  selectedSnapshot={this.props.selectedSnapshot} />
        <div className={classnames({
          [block + '__content']: true,
          [block + '__content--open']: open
        })}>
          <CloseSidebarButton closeSidebar={this.closeSidebar} />
          {this.renderContent()}
        </div>
      </div>
    );
  },

  renderContent() {
    if (!this.state.activeControl) {
      return null;
    }

    // special case mapstats so that it will not be part of the compiled artifact
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
                    highlightedSnapshot={this.props.highlightedSnapshot} />
        );
      case 'metrics':
        return <Metrics />;
      case 'details':
        return <Details snapshot={this.props.selectedSnapshot} />;
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
