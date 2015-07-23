'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import Collapsible from '../Collapsible';
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
      <div>
        <Collapsible key={'tags'}>
          <Collapsible.Header>
            Tags
          </Collapsible.Header>
          <Collapsible.Content>
            <div className={block}>
              {tags.map(tag =>
                <Tag key={tag}
                     tag={tag}
                     onClick={() => console.log('filter')}/>
              )}
            </div>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
});

export default TagList;
