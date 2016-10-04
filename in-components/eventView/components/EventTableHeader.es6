import React from 'react';

import {getQueryFieldNameForField} from 'in-components/eventView/components/FilterMenu';
import {sortDirection$} from 'in-components/eventView/stores/sortDirection';
import FilterMenu from 'in-components/eventView/components/FilterMenu';
import {sortBy$} from 'in-components/eventView/stores/sortBy';
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
        <Cell name='start'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='end'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='title'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />

        <Cell name='severity'
              expandedCell={expandedCell}
              onClick={cellName => this.setState({expandedCell: cellName})} />
      </div>
    );
  }
}));


const Cell = connectTo({
  sortDirection: sortDirection$,
  sortBy: sortBy$
},
({expandedCell, onClick, name, sortBy, sortDirection}) => {
  const isSelected = expandedCell === name;
  const isActive = sortBy === getQueryFieldNameForField(name);

  let toggleClassName = `${block}__cell-toggle`;
  if (isSelected || isActive) {
    toggleClassName += ` ${toggleClassName}--selected`;
  }

  return (
    <div key={name}
         className={`${block}__cell`}>

        {isSelected
          ? <div className={`${block}__filter`}>
              <FilterMenu field={name}
                          closeMenu={() => onClick(null)} />
            </div>
          : null
        }
      <div className={toggleClassName}
           onClick={() => onClick(isSelected ? null : name)}>
        {name}
        <Arrow isActive={isActive}
               sortDirection={sortDirection} />
      </div>
    </div>
  );
});


function Arrow({isActive, sortDirection}) {
  if (!isActive) {
    return null;
  }

  let toggleClassName = `${block}__icon-wrapper`;
  if (isActive) {
    toggleClassName += ` ${toggleClassName}--active`;
  }

  let iconType = 'triangle_down';
  if (isActive && sortDirection === 'desc') {
    iconType = 'triangle_up';
  }

  return (
    <div className={toggleClassName}>
      <SvgIcon className={`${block}__icon`}
               type={iconType}
               width={5}
               height={5}
               color='#6b8088' />
    </div>
  );
}
