import {Table, Column, Cell} from 'fixed-data-table';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
import React from 'react';

import './Table.less';


const rpt = React.PropTypes;
const block = 'in-table';

export default React.createClass({

  displayName: 'Table',

  propTypes: {
    headerDefinitions: rpt.array.isRequired,
    data: irpt.list.isRequired,
    cellClicked: rpt.func,
    canFilter: rpt.array
  },

  getInitialState() {
    return {
      filteredData: this.props.data
    };
  },

  render() {
    const headerDefinitions = this.props.headerDefinitions;
    const fullWidth = headerDefinitions.map(h => h.size).reduce((a, b) => a + b, 0);
    const filterableHeaders = this.props.canFilter;
    const data = this.state.filteredData;

    return (
      <div className={block}>
        {filterableHeaders ?
          <input className={block + '__filter'}
                 onChange={this.onFilterChange}
                 placeholder={'filter by ' + filterableHeaders.join(', ')}
          />
          : null
        }
        {filterableHeaders ? <br /> : null}
        <Table rowHeight={40}
               headerHeight={40}
               rowsCount={data.size}
               width={fullWidth}
               height={400}
               onRowClick={this.props.cellClicked}>

          {headerDefinitions.map(header =>
            <Column key={header.name}
                    header={<Cell>{header.name}</Cell>}
              cell={props => <Cell {...props}
                                   className={block + '__row'}>
                               {data.getIn([props.rowIndex, header.name])}
                             </Cell>
              }
              width={header.size}
            />
          )}
        </Table>
      </div>
    );
  },

  onFilterChange(e) {
    const data = this.props.data;
    let filterText = e.target.value;
    if (!filterText) {
      this.setState({ filteredData: data });
    }
    filterText = filterText.toLowerCase();

    const filteredData = [];
    const filterableHeaders = this.props.canFilter;

    data.forEach(item => {
      let matchesOne = false;

      // run through all defined filter headers and get the corresponding value
      // if the value matches the filterText -> show the row
      for (let i = 0; i < filterableHeaders.length; i++) {
        const cellContent = item.get(filterableHeaders[i]);
        if (!cellContent) {
          continue;
        }

        if (cellContent.toString().toLowerCase().indexOf(filterText) >= 0) {
          matchesOne = true;
          break;
        }
      }

      if (matchesOne) {
        filteredData.push(item);
      }
    });

    this.setState({ filteredData: Immutable.fromJS(filteredData) });
  }
});
