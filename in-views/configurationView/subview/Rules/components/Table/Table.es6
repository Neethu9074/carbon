import React from 'react';

import { TableRowWrapper, TableRow } from 'in-views/configurationView/subview/Rules/components/Table/TableRow';
import TableHeader from 'in-views/configurationView/subview/Rules/components/Table/TableHeader';

export default React.createClass({
  displayName: 'Table',

  getInitialState() {
    return {
      selectedRule: null
    };
  },

  render() {
    return (
      <div>
        <TableHeader />

        <TableRowWrapper>
          {this.props.items.map(item => (
            <TableRow
              key={item.get('id')}
              rule={item}
              isSelected={this.state.selectedRule === item}
              onClick={this.toggleAlert}
              onDeleteRule={this.props.onDeleteRule}
              status={this.props.status[item.get('id')]}
            />
          ))}
        </TableRowWrapper>
      </div>
    );
  },

  toggleAlert(rule) {
    this.setState({ selectedRule: this.state.selectedRule === rule ? null : rule });
  }
});
