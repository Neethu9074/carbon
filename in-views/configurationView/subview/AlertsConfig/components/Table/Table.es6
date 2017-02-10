import React from 'react';

import {TableRowWrapper, TableRow} from 'in-views/configurationView/subview/AlertsConfig/components/Table/TableRow';
import TableHeader from 'in-views/configurationView/subview/AlertsConfig/components/Table/TableHeader';

import './Table.less';


const block = 'in-table';

export default React.createClass({

  displayName: 'Table',

  getInitialState() {
    return {
      selectedAlert: null
    };
  },

  render() {
    return (
      <div className={block}>
        <TableHeader />

        <TableRowWrapper>
          {this.props.items.map(item =>
            <TableRow key={item.get('id')}
                      data={item}
                      isSelected={this.state.selectedAlert === item}
                      onClick={this.toggleAlert} />
          )}
        </TableRowWrapper>
      </div>
    );
  },

  toggleAlert(alert) {
    this.setState({selectedAlert: this.state.selectedAlert === alert ? null : alert});
  }
});
