import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {getFilterableTags} from 'in-stores/filtering';
import connectTo from 'in-hoc/connectTo';

import Tag from '../Tag';

import './TagListAll.less';

export default connectTo({
    tags: getFilterableTags()
  }, React.createClass({
  displayName: 'TagListAll',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    tags: irpt.list
  },

  render() {
    let tags = this.props.tags;
    if (!tags || tags.size === 0) {
      return (
        <div className={'in-tag-list-all__no-tags'}>
          There are no tags defined
        </div>
      );
    }

    tags = tags.sort();
    return (
      <div>
        {tags.toArray().map(tag =>
          <Tag key={tag}
               tag={tag}
               isDark={true}/>
        )}
      </div>
    );
  }

}));
