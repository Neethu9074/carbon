import React from 'react/addons';

import Tooltip from 'in-components/Tooltip';

import TagToolTip from '../../Tooltips/Tag';
import Tag from './Tag';

import './TagFrame.less';

export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    tags: React.PropTypes.object.isRequired
  },

  render() {
    const tags = this.props.tags;
    if (tags.size === 0) {
      return null;
    }

    return (
      <div className='in-sticky-note__tag-frame'>
        <ul className='in-tooltip__tag-frame__ul'>
          {tags.map(tag => {
            return (
              <li key={tag} className='in-tooltip__tag-frame__li'>
                <Tooltip content={<TagToolTip tag={tag}/>}>
                  <Tag tag={tag}/>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});
