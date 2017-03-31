import React from 'react';

import {
  TableRowWrapper,
  TableRow
} from 'in-views/configurationView/subview/ObjectivesConfig/components/Table/TableRow';
import TableHeader from 'in-views/configurationView/subview/ObjectivesConfig/components/Table/TableHeader';

export default React.createClass({
  displayName: 'Table',

  getInitialState() {
    return {
      selectedObjective: null
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
              objective={item}
              isSelected={this.state.selectedObjective === item}
              onClick={this.toggleObjective}
              onDeleteObjective={this.props.onDeleteObjective}
              setEnabled={this.props.setEnabled}
              status={this.props.status[item.get('id')]}
            />
          ))}
        </TableRowWrapper>
      </div>
    );
  },

  toggleObjective(objective) {
    this.setState({ selectedObjective: this.state.selectedObjective === objective ? null : objective });
  }
});
