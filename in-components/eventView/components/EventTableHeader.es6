import React from 'react';

import {eventFilter$, FILTER} from 'in-components/eventView/stores/eventFilterStore';
import FilterMenu from 'in-components/eventView/components/FilterMenu';
import connectTo from 'in-hoc/connectTo';

import './EventTableHeader.less';


const rpt = React.PropTypes;
const block = 'in-event-view-event-table-header';

export default connectTo({
  eventFilter: eventFilter$
},
React.createClass({

  displayName: 'EventTableHeader',

  propTypes: {
    eventFilter: rpt.number.isRequired
  },

  getInitialState() {
    return {
      expandedCell: null
    };
  },

  render() {
    const tableDefinition = this.props.eventFilter === FILTER.INCIDENTS
      ? this.incidentTableDefinition
      : this.eventTableDefinition;

    return (
      <div className={block}>
        {tableDefinition()}
      </div>
    );
  },

  renderCell(name, isIncident = false) {
    const isSelected = this.state.expandedCell === name;
    let className = block + (isIncident ? '__incident-cell' : '__cell');
    if (isSelected) {
      className += ` ${className}--selected`;
    }

    return (
      <div key={name}
           className={className}
           onClick={() => {
             this.setState({
               expandedCell: isSelected ? null : name
             });
           }}>
        {name}
        {isSelected
          ? <div className={`${block}__filter`}>
              <FilterMenu />
            </div>
          : null
        }
      </div>
    );
  },

  eventTableDefinition() {
    return [
      this.renderCell('Type'),
      this.renderCell('Started'),
      this.renderCell('Ended'),
      this.renderCell('Problem Text'),
      this.renderCell('Entity')
    ];
  },

  incidentTableDefinition() {
    return [
      this.renderCell('Started', true),
      this.renderCell('Ended', true),
      this.renderCell('Triggered by', true),
      this.renderCell('On', true)
    ];
  }
}));
