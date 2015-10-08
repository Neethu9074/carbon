import irpt from 'react-immutable-proptypes';
import React from 'react/addons';
import _ from 'lodash';

import * as filters from 'in-services/stores/filters';
import {createTagFilter} from 'in-services/filtering';
import * as viewStore from 'in-services/stores/view';
import classnames from 'in-services/util/classnames';
import {getColor} from 'in-services/tags';

import ResetButton from './ResetButton';
import ListHeader from './ListHeader';
import enhance from '../hoc/enhance';
import './Tags.less';

const rpt = React.PropTypes;
const block = 'in-sidebar-tag-listing';

const SidebarTagListing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshots: rpt.array.isRequired,
    activeFilters: irpt.list.isRequired
  },

  statics: {
    createObservables() {
      return {
        snapshots: viewStore.viewStructure.map(viewStructure => {
          return viewStructure.map(nodeStructure => nodeStructure.node);
        }),
        activeFilters: filters.activeFilters
      };
    }
  },

  render() {
    const tags = this.getAllTags().sort();

    return (
      <div>

        <ListHeader header={'Tags'}/>

        <ResetButton onClick={this.clearAllTags} />

        <ol className={block}>
          {tags.map(tag => {
            return (
              <li className={classnames({
                    [block + '__tag']: true,
                    [block + '__tag--active']: this.isTagFilterActive(tag)
                  })}
                  key={tag}
                  onClick={() => this.toggleFilter(tag)}>
                <div style={{background: getColor(tag)}}
                     className={block + '__bubble'} />
                {tag}
              </li>
            );
          })}
        </ol>
      </div>
    );
  },

  clearAllTags() {
    filters.removeFiltersWithType('tag');
  },

  getAllTags() {
    if (!this.props.snapshots) {
      return [];
    }

    let tags = [];

    this.props.snapshots.forEach(snapshot => {
      const t = snapshot.get('tags');
      if (t) {
        tags = tags.concat(t.toArray());
      }
    });

    return _.uniq(tags);
  },

  isTagFilterActive(tag) {
    return !!this.props.activeFilters.some(filter => {
      return filter.get('type') === 'tag' && filter.get('label') === tag;
    });
  },

  toggleFilter(tag) {
    if (this.isTagFilterActive(tag)) {
      filters.removeFilter(createTagFilter(tag));
    } else {
      filters.addFilter(createTagFilter(tag));
    }
  }
});

export default enhance(SidebarTagListing);
