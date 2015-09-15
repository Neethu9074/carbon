import _ from 'lodash';
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import * as viewStore from 'in-services/stores/view';
import {getColor} from 'in-services/tags';
import classnames from 'in-services/util/classnames';
import {createTagFilter} from 'in-services/filtering';
import * as filters from 'in-services/stores/filters';

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
        <h1 className={block + '__label'}>Tags</h1>
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
