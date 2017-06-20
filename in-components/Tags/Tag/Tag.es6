import rpt from 'prop-types';
import React from 'react';

import { setTagFilter, removeTagFilter, filteredTags$ } from 'in-stores/search/keywords/tags';
import { getColorPool } from 'in-services/util/ColorGenerator';
import connectTo from 'in-hoc/connectTo';

import './Tag.less';

const block = 'in-tag';

export default connectTo(
  props => {
    return {
      active: filteredTags$.map(tags => tags.contains(props.tag.toLowerCase())).startWith(false)
    };
  },
  class extends React.PureComponent {
    static displayName = 'Tag';

    static propTypes = {
      active: rpt.bool.isRequired,
      tag: rpt.string.isRequired,
      isDark: rpt.bool
    };

    render() {
      const { isDark, active, tag } = this.props;
      const color = getColorPool('tags').getColorHex(tag);

      let className = block;
      if (active) {
        className += ` ${block}__active`;
      }
      if (isDark) {
        className += ` ${block}__dark`;
        if (active) {
          className += ` ${block}__dark__active`;
        }
      }

      return (
        <div className={className} style={{ borderLeft: `3px solid ${color}` }} onClick={this.onClick}>
          {tag}
        </div>
      );
    }

    onClick = () => {
      if (this.props.active) {
        removeTagFilter(this.props.tag);
      } else {
        setTagFilter(this.props.tag);
      }
    };
  }
);
