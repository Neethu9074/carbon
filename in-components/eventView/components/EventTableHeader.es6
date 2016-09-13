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
    return (
      <div className={block}>
        {this.renderCell('Type')}
        {this.renderCell('Started')}
        {this.renderCell('Ended')}
        {this.renderCell('Problem Text')}

        {this.props.eventFilter === FILTER.INCIDENTS
          ? this.renderCell('Affected')
          : this.renderCell('Entity')
        }
      </div>
    );
  },

  renderCell(name) {
    const isSelected = this.state.expandedCell === name;
    let className = `${block}__cell`;
    if (isSelected) {
      className += ` ${className}--selected`;
    }

    return (
      <div className={className}
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
  }
}));
