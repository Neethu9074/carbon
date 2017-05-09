import React from 'react';

import {
  TableRowWrapper,
  TableRow
} from 'in-views/configurationView/subview/ServiceExtraction/components/Table/TableRow';
import TableHeader from 'in-views/configurationView/subview/ServiceExtraction/components/Table/TableHeader';

export default class extends React.Component {
  static displayName = 'ServiceRulesTable';

  state = {
    selectedRule: null,
    rules: this.props.items.toArray()
  };

  componentWillUpdate(nextProps) {
    if (this.props.items !== nextProps.items) {
      this.setState({
        rules: nextProps.items.toArray()
      });
    }
  }

  render() {
    return (
      <div>
        <TableHeader />

        <TableRowWrapper>
          {this.state.rules
            .sort((a, b) => a.get('order') - b.get('order'))
            .map(item => (
              <TableRow
                key={item.get('id')}
                rule={item}
                moveUp={this.moveUp}
                moveDown={this.moveDown}
                ruleType={this.props.ruleType}
                isSelected={this.state.selectedRule === item}
                onClick={this.toggleRule}
                onDeleteService={this.props.onDeleteService}
                setEnabled={this.props.setEnabled}
                status={this.props.status[item.get('id')]}
              />
            ))}
        </TableRowWrapper>
      </div>
    );
  }

  moveUp = rule => {
    this.swap(rule, this.getRuleBefore(rule));
  };

  moveDown = rule => {
    this.swap(rule, this.getRuleAfter(rule));
  };

  getRuleBefore(rule) {
    const ruleId = rule.get('id');
    for (let i = 1, length = this.state.rules.length; i < length; i++) {
      if (this.state.rules[i].get('id') === ruleId) {
        return this.state.rules[i - 1];
      }
    }
  }

  getRuleAfter(rule) {
    const ruleId = rule.get('id');
    for (let i = 0, length = this.state.rules.length - 1; i < length; i++) {
      if (this.state.rules[i].get('id') === ruleId) {
        return this.state.rules[i + 1];
      }
    }
  }

  swap(a, b) {
    if (!a || !b) {
      return;
    }

    const aId = a.get('id');
    const bId = b.get('id');
    const updatedList = [];

    for (let i = 0, length = this.state.rules.length; i < length; i++) {
      let rule = this.state.rules[i];
      if (rule.get('id') === aId) {
        rule = rule.set('order', b.get('order'));
      }
      if (rule.get('id') === bId) {
        rule = rule.set('order', a.get('order'));
      }
      updatedList.push(rule);
    }

    this.setState({
      rules: updatedList
    });

    this.props.orderHasChanged(updatedList);
  }

  toggleRule = rule => {
    this.setState({ selectedRule: this.state.selectedRule === rule ? null : rule });
  };
}
