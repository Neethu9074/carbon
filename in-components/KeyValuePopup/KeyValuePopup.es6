import irpt from 'react-immutable-proptypes';
import React from 'react';

import PopUpable from 'in-components/PopUpable';

import './KeyValuePopup.less';

const block = 'in-key-value-popup';

export default React.createClass({
  displayName: 'KeyValuePopup',

  propTypes: {
    header: React.PropTypes.string.isRequired,
    data: irpt.map.isRequired
  },

  getInitialState() {
    return {
      filter: ''
    };
  },

  resetFilter() {
    this.setState({
      filter: ''
    });
  },

  onFilterChange(e) {
    this.setState({filter: e.target.value});
  },

  render() {
    if (this.props.data == null || this.props.data.size === 0) {
      return null;
    }

    const filter = this.state.filter.toLowerCase().trim();
    let filterPredicate;

    if (filter.length === 0) {
      filterPredicate = () => true;
    } else {
      filterPredicate = (v, k) => {
        return k.toLowerCase().indexOf(filter) !== -1 ||
          String(v).toLowerCase().indexOf(filter) !== -1;
      };
    }

    return (
      <PopUpable onClose={this.resetFilter}>
        <PopUpable.Header>
          {this.props.header}
        </PopUpable.Header>
        <PopUpable.Content>
          <div>
            <input type='search'
                   value={this.state.filter}
                   onChange={this.onFilterChange}
                   placeholder='Search…'
                   className={block + '__filter-input'}/>

            {this.props.data
              .filter(filterPredicate)
              .sortBy((v, k) => k)
              .map((v, k) =>
                <div key={k}
                     className={block + '__item'}>
                  <dt className={block + '__title'}>
                    {k}
                  </dt>
                  <dd className={block + '__text'}>
                    {v}
                  </dd>
                </div>
              )
              .valueSeq()
              .toArray()}
          </div>
        </PopUpable.Content>
      </PopUpable>
    );
  }
});
