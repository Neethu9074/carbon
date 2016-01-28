import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import Tag from '../Tag';

import './TagListSnapshot.less';

const block = 'in-tag-list-snapshot';

const TagListSnapshot = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    const tags = this.props.snapshot.get('processorTags');
    if (!tags || tags.size === 0) {
      return null;
    }

    return (
      <div className={block}>
        {tags.map((tag) =>
          <Tag key={tag}
               tag={tag}/>
        )}
      </div>
    );
  }
});

export default TagListSnapshot;
