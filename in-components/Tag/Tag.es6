import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {createTagFilter} from 'in-services/filtering';
import * as filters from 'in-services/stores/filters';
import {getColor} from 'in-services/tags';

import enhance from '../hoc/enhance';

import './Tag.less';

const rpt = React.PropTypes;
const block = 'in-tag';

const Tag = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    activeFilters: irpt.list.isRequired,
    tag: rpt.string.isRequired,
    onClick: rpt.func,
    isDark: rpt.bool
  },

  statics: {
    createObservables() {
      return {
        activeFilters: filters.activeFilters
      };
    }
  },

  componentWillMount() {
    this.filter = createTagFilter(this.props.tag);
  },

  render() {
    let className;
    if (this.props.isDark) {
      className = this.isActive() ?
        block + ' ' + block + '__dark ' + block + '__active ' + block + '__dark__active'
        : block + '__dark ' + block;
    } else {
      className = this.isActive() ? block + ' ' + block + '__active' : block;
    }

    return (
      <div className={className}
           onClick={this.onClick}>
        <div className={block + '__point'}
             style={{background: String(getColor(this.props.tag))}} />
        <span className={block + '__label'}>
          {this.props.tag}
        </span>
      </div>
    );
  },

  isActive() {
    for (let i = 0; i < this.props.activeFilters.size; i++) {
      const a = this.props.activeFilters.get(i);
      const b = this.filter;
      if (a && b && a.get('type') === b.get('type') && a.get('label') === b.get('label')) {
        return true;
      }
    }
    return false;
  },

  onClick() {
    if (this.isActive()) {
      filters.removeFilter(this.filter);
    } else {
      filters.addFilter(this.filter);
    }
  }
});

export default enhance(Tag);
