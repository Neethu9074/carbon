import Immutable from 'immutable';
import React from 'react';

import classnames from 'in-services/util/classnames';
import Table from 'in-components/Table';

import CloseFilterbarButton from './CloseFilterbarButton';
import ComponentList from './ComponentList';
import Controls from './Controls';
import MapStats from './MapStats';
import Metrics from './Metrics';
import Tags from './Tags';

import './Filterbar.less';

const block = 'in-filterbar';

const Filterbar = React.createClass({
  getInitialState() {
    return { activeControl: null };
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
          <CloseFilterbarButton closeFilterbar={this.closeFilterbar} />
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

    if (__DEV__ && this.state.activeControl === 'table') {
      const tableData = [];
      for (let i = 0; i < 100; i++) {
        tableData[i] = { id: i, name: 'name ' + i };
      }
      return (
        <Table data={Immutable.fromJS(tableData)}
               headerDefinitions={[
                 {name: 'id', size: 100},
                 {name: 'name', size: 200}
               ]}
        />
      );
    }

    switch (this.state.activeControl) {
      case 'tags':
        return <Tags/>;
      case 'metrics':
        return <Metrics/>;
      case 'components':
        return <ComponentList/>;
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

  closeFilterbar() {
    this.setState({
      activeControl: null
    });
  }
});

export default Filterbar;
