import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import irpt from 'react-immutable-proptypes';

import {tagsFilter$} from 'in-components/Filterbar/filterBarStores';
import {getFilterableTags} from 'in-stores/filtering';
import connectTo from 'in-hoc/connectTo';

import Tag from '../Tag';

import './TagListAll.less';

export default connectTo({
    tags: getFilterableTags(),
    tagsFilter: tagsFilter$
  }, React.createClass({
  displayName: 'TagListAll',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    tags: irpt.list,
    tagsFilter: React.PropTypes.string.isRequired
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

    tags = tags.toArray();

    const tagsFilter = this.props.tagsFilter.toLowerCase();
    if (tagsFilter.length > 0) {
      tags = tags.filter(tag => tag.toLowerCase().indexOf(tagsFilter) !== -1);
    }

    return (
      <div>
        {tags.map(tag =>
          <Tag key={tag}
               tag={tag}
               isDark={true}/>
        )}
      </div>
    );
  }

}));
