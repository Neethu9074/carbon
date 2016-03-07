/* eslint-disable no-nested-ternary */
import {Table, Column, Cell} from 'fixed-data-table';
import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
import React from 'react';

import './Table.less';


const rpt = React.PropTypes;
const block = 'in-table';

const SORT_TYPES = {
  ASC: 'ASC',
  DESC: 'DESC'
};


export default React.createClass({

  displayName: 'Table',

  propTypes: {
    headerDefinitions: rpt.array.isRequired,
    data: irpt.list.isRequired,
    cellClicked: rpt.func,
    canFilter: rpt.array,
    canSort: rpt.array
  },

  getInitialState() {
    return {
      filteredData: this.props.data,
      sortByHeaderName: undefined,
      sortDirection: undefined
    };
  },

  render() {
    const headerDefinitions = this.props.headerDefinitions;
    const fullWidth = headerDefinitions.map(h => h.size).reduce((a, b) => a + b, 0);
    const sortByHeaderName = this.state.sortByHeaderName;
    const filterableHeaders = this.props.canFilter;
    const sortableHeaders = this.props.canSort;
    const sortDir = this.state.sortDirection;
    const data = sortByHeaderName ?
      this.state.filteredData.sort((a, b) => {
        return sortDir === SORT_TYPES.ASC ?
          a.get(sortByHeaderName).toString().localeCompare(b.get(sortByHeaderName)) :
          b.get(sortByHeaderName).toString().localeCompare(a.get(sortByHeaderName));
      }) :
      this.state.filteredData;

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

          {headerDefinitions.map(header => {
            const headerName = header.name;
            return (
              <Column key={headerName}
                      header={sortableHeaders.indexOf(headerName) >= 0 ?
                            <Cell onClick={() => this.onSortChange(headerName)}>
                              {headerName}
                              {sortDir && sortByHeaderName === headerName ?
                                (sortDir === SORT_TYPES.DESC ? ' ↓' : ' ↑')
                                : ''}
                            </Cell> :
                            <Cell>{headerName}</Cell>
                          }
                      cell={props => <Cell {...props}
                                           className={block + '__row'}>
                                      {data.getIn([props.rowIndex, headerName])}
                                     </Cell>
                           }
                      width={header.size}
              />
          );
        })}
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
      // run through all defined filter headers and get the corresponding value
      // if the value matches the filterText -> show the row
      for (let i = 0; i < filterableHeaders.length; i++) {
        const cellContent = item.get(filterableHeaders[i]);
        if (!cellContent) {
          continue;
        }

        if (cellContent.toString().toLowerCase().indexOf(filterText) >= 0) {
          filteredData.push(item);
          break;
        }
      }
    });

    this.setState({ filteredData: Immutable.fromJS(filteredData) });
  },

  onSortChange(headerName) {
    const sortDir = this.state.sortDirection;
    if (sortDir === SORT_TYPES.ASC) {
      this.setState({
        sortDirection: SORT_TYPES.DESC,
        sortByHeaderName: headerName
      });
    } else {
      this.setState({
        sortDirection: SORT_TYPES.ASC,
        sortByHeaderName: headerName
      });
    }
  }
});
