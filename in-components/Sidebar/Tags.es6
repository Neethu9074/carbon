import _ from 'lodash';
import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import * as viewStore from 'in-services/stores/view';
import {getColor} from 'in-services/tags';
import classnames from 'in-services/util/classnames';
import * as mapFilters from 'in-services/stores/mapFilters';

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
        activeFilters: mapFilters.filters
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
