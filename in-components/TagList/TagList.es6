import React from 'react/addons';
import irpt from 'react-immutable-proptypes';

import {createTagFilter} from 'in-services/filtering';
import * as filters from 'in-services/stores/filters';

import Tag from '../Tag';

import './TagList.less';

const block = 'in-tag-list';

const TagList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const tags = this.props.snapshot.get('tags');
    if (!tags || tags.size === 0) {
      return null;
    }

    return (
      <div className={block}>
        {tags.map((tag) =>
          <Tag key={tag}
               tag={tag}
               onClick={() => filters.addFilter(createTagFilter(tag))}/>
        )}
      </div>
    );
  }
});

export default TagList;
