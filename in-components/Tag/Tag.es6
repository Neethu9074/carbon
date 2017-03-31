import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import { setTagFilter, removeTagFilter, filteredTags$ } from 'in-stores/search/keywords/tags';
import { getColorPool } from 'in-services/util/ColorGenerator';
import connectTo from 'in-hoc/connectTo';

import './Tag.less';

const rpt = React.PropTypes;
const block = 'in-tag';

export default connectTo(
  props => {
    return {
      active: filteredTags$.map(tags => tags.contains(props.tag.toLowerCase())).startWith(false)
    };
  },
  React.createClass({
    displayName: 'Tag',

    mixins: [PureRenderMixin],

    propTypes: {
      active: rpt.bool.isRequired,
      tag: rpt.string.isRequired,
      isDark: rpt.bool
    },

    render() {
      let className;
      if (this.props.isDark) {
        className = this.props.active
          ? block + ' ' + block + '__dark ' + block + '__active ' + block + '__dark__active'
          : block + '__dark ' + block;
      } else {
        className = this.props.active ? block + ' ' + block + '__active' : block;
      }

      return (
        <div className={className} onClick={this.onClick}>
          <div
            className={block + '__point'}
            style={{ background: String(getColorPool('tags').getColorHex(this.props.tag)) }}
          />
          <span className={block + '__label'}>
            {this.props.tag}
          </span>
        </div>
      );
    },

    onClick() {
      if (this.props.active) {
        removeTagFilter(this.props.tag);
      } else {
        setTagFilter(this.props.tag);
      }
    }
  })
);
