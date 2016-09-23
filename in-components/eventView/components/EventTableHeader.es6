import React from 'react';

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
  let toggleClassName = `${block}__cell-toggle`;
  if (isSelected) {
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
        <Arrow isSelected={isSelected} />
      </div>
    </div>
  );
}

function Arrow({isSelected}) {
  let toggleClassName = `${block}__icon-wrapper`;
  if (isSelected) {
    toggleClassName += ` ${toggleClassName}--selected`;
  }

  return (
    <div className={toggleClassName}>
      <SvgIcon className={`${block}__icon`}
               type={isSelected ? 'triangle_up' : 'triangle_down'}
               width={5}
               height={5}
               color='#6b8088' />
    </div>
  );
}
