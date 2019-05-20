import React from 'react';

import Input from 'in-components/form/Input';
import Table from 'in-components/Table';

import locals from './SearchableTable.mless';

export default class SearchableTable extends React.Component {
  state = {
    filter: ''
  };

  render() {
    const rightHeader = (
      <Input
        type="search"
        value={this.state.filter}
        onChange={e =>
          this.setState({
            filter: e.target.value
          })
        }
        placeholder="Search…"
        className={locals.searchInput}
      />
    );

    return <Table filter={this.state.filter} {...this.props} rightHeader={rightHeader} alwaysShowPagination />;
  }
}
