import { create } from 'reactive-observables';
import React from 'react';

import SearchField from 'in-applications/Table/components/SearchField';
import Pagination from 'in-applications/Table/components/Pagination';
import Columns from 'in-applications/Table/components/Columns';
import Row from 'in-applications/Table/components/Row';

import locals from './Table.mless';

export default class extends React.Component {
  static displayName = 'Application-Table';

  state = {
    query: '',
    orderBy: 'id',
    orderDirection: 'ASC',
    page: 1
  };

  change$ = create();

  componentWillMount() {
    this.changeSubscription = this.change$
      .debounce(500)
      .subscribe(state => this.props.onStateChanged({ ...state, pageSize: this.props.pageSize }));
    this.change$.emit(this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.query !== nextState.query ||
      this.state.orderBy !== nextState.orderBy ||
      this.state.orderDirection !== nextState.orderDirection ||
      this.state.page !== nextState.page
    ) {
      this.change$.emit(nextState);
    }
  }

  componentWillUnmount() {
    this.changeSubscription.dispose();
  }

  render() {
    const { items, totalHits, pageSize, columnDefinitions } = this.props;
    return (
      <div>
        <div className={locals.header}>
          <Pagination
            page={this.state.page}
            pageSize={pageSize}
            totalHits={totalHits}
            setPage={page => this.setState({ page })}
          />
          <SearchField onChange={query => this.setState({ query })} />
        </div>
        <table className={locals.table}>
          <thead>
            <Columns
              setOrder={(orderBy, orderDirection) => this.setState({ orderBy, orderDirection })}
              columnDefinitions={columnDefinitions}
              orderBy={this.state.orderBy}
              orderDirection={this.state.orderDirection}
            />
          </thead>
          <tbody>
            {items.map((item, i) => <Row key={item.id || i} item={item} columnDefinitions={columnDefinitions} />)}
          </tbody>
        </table>
      </div>
    );
  }
}
