import React from 'react';

import classnames from 'in-services/util/classnames';

import CloseSidebarButton from './CloseSidebarButton';
import Tags from './Tags';
import ZoneList from './ZoneList';
import Controls from './Controls';
import MapStats from './MapStats';
import Metrics from './Metrics';

import './Sidebar.less';

const block = 'in-sidebar';

const Sidebar = React.createClass({

  getInitialState() {
    return {
      activeControl: null
    };
  },

  shouldComponentUpdate(newProps, newState) {
    return this.state.activeControl !== newState.activeControl;
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
                  onChangeActiveControl={this.onChangeActiveControl} />
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
        return <Tags />;
      case 'snapshotList':
        return <ZoneList />;
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

export default Sidebar;
