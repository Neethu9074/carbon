import React from 'react';

import FilterMenu from 'in-components/eventView/components/FilterMenu';
import connectTo from 'in-hoc/connectTo';

import './EventTableHeader.less';


const block = 'in-event-view-event-table-header';

export default connectTo({
},
React.createClass({

  displayName: 'EventTableHeader',

  getInitialState() {
    return {
      expandedCell: null
    };
  },

  render() {
    const expandedCell = this.state.expandedCell;

    return (
      <div className={block}>
        <Cell name='Start'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='End'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='Title'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='Severity'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />
      </div>
    );
  }
}));

function Cell({expandedCell, onClick, name}) {
  const isSelected = expandedCell === name;
  let className = `${block}__cell`;
  if (isSelected) {
    className += ` ${className}--selected`;
  }

  return (
    <div key={name}
         className={className}
         onClick={() => onClick(isSelected ? null : name)}>
      {name}
      {isSelected
        ? <div className={`${block}__filter`}>
            <FilterMenu />
          </div>
        : null
      }
    </div>
  );
}
