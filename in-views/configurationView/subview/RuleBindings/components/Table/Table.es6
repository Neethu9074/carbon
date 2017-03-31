import React from 'react';

import { TableRowWrapper, TableRow } from 'in-views/configurationView/subview/RuleBindings/components/Table/TableRow';
import TableHeader from 'in-views/configurationView/subview/RuleBindings/components/Table/TableHeader';

export default React.createClass({
  displayName: 'Table',

  getInitialState() {
    return {
      selectedRuleBinding: null
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
              ruleBinding={item}
              isSelected={this.state.selectedRuleBinding === item}
              onClick={this.toggleRuleBinding}
              onDeleteRuleBinding={this.props.onDeleteRuleBinding}
              setEnabled={this.props.setEnabled}
              status={this.props.status[item.get('id')]}
            />
          ))}
        </TableRowWrapper>
      </div>
    );
  },

  toggleRuleBinding(ruleBinding) {
    this.setState({ selectedRuleBinding: this.state.selectedRuleBinding === ruleBinding ? null : ruleBinding });
  }
});
