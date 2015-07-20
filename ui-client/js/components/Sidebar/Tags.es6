'use strict';

import _ from 'lodash';
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {getColor} from 'instana-ui-services/tags';
import classnames from 'instana-ui-services/util/classnames';
import * as mapFilters from 'instana-ui-services/stores/mapFilters';

import enhance from '../enhance';

import './Tags.less';

const block = 'in-sidebar-tag-listing';

const SidebarTagListing = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshots: irpt.list.isRequired,
    activeFilters: irpt.list.isRequired
  },

  statics: {
    createObservables() {
      return {
        activeFilters: mapFilters.filters
      };
    }
  },

  render() {
    const tags = this.getAllTags().sort();

    return (
      <ol className={block}>
        {tags.map(tag => {
          const activeFilter = this.getActiveFilter(tag);
          return (
            <li className={classnames({
                  [block + '__tag']: true,
                  [block + '__tag--active']: !!activeFilter
                })}
                key={tag}
                onClick={() => this.toggleFilter(tag, activeFilter)}>
              <div style={{background: getColor(tag)}}
                   className={block + '__bubble'}>
              </div>
              {tag}
            </li>
          );
        })}
      </ol>
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

  getActiveFilter(tag) {
    return this.props.activeFilters.find(filter => {
      return filter.get('type') === 'tag' && filter.get('label') === tag;
    });
  },

  toggleFilter(tag, activeFilter) {
    if (activeFilter) {
      mapFilters.remove(activeFilter);
    } else {
      mapFilters.addTagFilter(tag);
    }
  }
});

export default enhance(SidebarTagListing);
