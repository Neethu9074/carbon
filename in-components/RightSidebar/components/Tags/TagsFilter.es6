import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {tagsFilter$, setTagsFilter} from 'in-components/RightSidebar/stores/rightSidebarFilterStore';
import connectTo from 'in-hoc/connectTo';

import './TagsFilter.less';


const block = 'in-tags-filter';

export default connectTo({
    tagsFilter: tagsFilter$
  }, React.createClass({
  displayName: 'TagsFilter',

  mixins: [PureRenderMixin],

  propTypes: {
    tagsFilter: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div className={block}>
        <input placeholder='Search…'
               type='search'
               value={this.props.tagsFilter}
               onChange={this.onChange}
               className={block + '__input'} />
      </div>
    );
  },

  onChange(e) {
    setTagsFilter(e.target.value);
  }
}));
