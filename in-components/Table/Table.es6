/* eslint-disable no-nested-ternary */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Column, Cell} from 'fixed-data-table';
import React from 'react';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';

import './Table.less';


const rpt = React.PropTypes;
const block = 'in-table';

const SORT_TYPES = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export default React.createClass({

  displayName: 'Table',

  mixins: [
    SubscriptionMixin,
    PureRenderMixin
  ],

  propTypes: {
    headerDefinitions: rpt.array.isRequired,
    cellClicked: rpt.func,
    canFilter: rpt.array,
    canSort: rpt.array,
    data: rpt.object
  },

  getInitialState() {
    return {
      sortByHeaderName: undefined,
      sortDirection: undefined,
      data: undefined
    };
  },

  componentWillMount() {
    this.addSubscription(this.props.data.subscribe(data => this.setState({
      data
    })));
  },

  render() {
    const data = this.state.data;
    if (!data) {
      return null;
    }

    const headerDefinitions = this.props.headerDefinitions;
    const fullWidth = headerDefinitions.map(h => h.size).reduce((a, b) => a + b, 0);
    const sortByHeaderName = this.state.sortByHeaderName;
    const filterableHeaders = this.props.canFilter;
    const sortableHeaders = this.props.canSort;
    const sortDir = this.state.sortDirection;

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
    console.log('TODO: send the filter event together with the filter-string (' + e.target.value + ') to server');
  },

  onSortChange(headerName) {
    console.log('TODO: send the sort event together with the header name to server');

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
