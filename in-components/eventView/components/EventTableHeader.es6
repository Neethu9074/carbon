import React from 'react';

import {sortDirection$, toggleSortDirection} from 'in-components/eventView/stores/sortDirection';
import {getQueryFieldNameForField} from 'in-components/eventView/components/FilterMenu';
import {sortBy$, setSortBy} from 'in-components/eventView/stores/sortBy';
import FilterMenu from 'in-components/eventView/components/FilterMenu';
import SvgIcon from 'in-components/SvgIcon';
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
        <Cell label=''
              name='severity'
              field='problem.severity'
              expandedCell={expandedCell}
              onExpandClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='start'
              field='start'
              expandedCell={expandedCell}
              onExpandClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='end'
              field='end'
              expandedCell={expandedCell}
              onExpandClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='title'
              field='problem.problemText'
              expandedCell={expandedCell}
              onExpandClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='on' />
      </div>
    );
  }
}));


const Cell = connectTo({
  sortDirection: sortDirection$,
  sortBy: sortBy$
},
({expandedCell, onExpandClick, name, field, label = name, sortBy, sortDirection}) => {
  const cellClassName = `${block}__cell`;

  // return a simple, non interactive cell if there is no backend field defined
  if (!field) {
    return (
      <div key={name}
           className={cellClassName}>
        <div className={`${cellClassName}-simple`}>
          {label ? label : <div className={`${block}__empty-label`} />}
        </div>
      </div>
    );
  }

  let toggleClassName = `${cellClassName}-toggle`;
  const isSelected = expandedCell === name;
  const isActive = sortBy === getQueryFieldNameForField(name);
  if (isSelected || isActive) {
    toggleClassName += ` ${toggleClassName}--selected`;
  }

  return (
    <div key={name}
         className={cellClassName}>

        {isSelected
          ? <div className={`${block}__filter`}>
              <FilterMenu field={name}
                          closeMenu={() => onExpandClick(null)} />
            </div>
          : null
        }
      <div className={toggleClassName}
           onClick={() => {
             setSortBy(field);
             toggleSortDirection();
           }}>

        {label ? label : <div className={`${block}__empty-label`} />}

        <Arrow isActive={isActive}
               isSelected={isSelected}
               sortDirection={sortDirection}
               onClick={e => {
                 e.stopPropagation();
                 onExpandClick(isSelected ? null : name);
               }} />
      </div>
    </div>
  );
});


function Arrow({isActive, isSelected, sortDirection, onClick}) {
  let toggleClassName = `${block}__icon-wrapper`;
  if (isSelected) {
    toggleClassName += ` ${toggleClassName}--selected`;
  }

  let iconType = 'triangle_up';
  if (isActive && sortDirection === 'desc') {
    iconType = 'triangle_down';
  }

  return (
    <div className={toggleClassName}
         onClick={onClick}>
      <SvgIcon className={`${block}__icon`}
               type={iconType}
               width={5}
               height={5}
               color='#6b8088' />
    </div>
  );
}
