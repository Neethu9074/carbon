'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import Icon from 'in-components/Icon';
import * as mapFilters from 'in-services/stores/mapFilters';

import './FilterBadge.less';

const block = 'in-query-builder__filter-badge';

const FilterBadge = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    filter: irpt.map.isRequired
  },

  render() {
    const filter = this.props.filter;
    return (
      <div className={block}>
        <Icon type={filter.get('icon')}/>
        <span className={block + '__label'}>
          {filter.get('label')}
        </span>
        <span onClick={this.remove}
              className={block + '__remove'}>
          x
        </span>
      </div>
    );
  },

  remove() {
    mapFilters.remove(this.props.filter);
  }
});

export default FilterBadge;
