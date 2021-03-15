/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { setTagFilter, removeTagFilter, filteredTags$ } from 'in-stores/search/keywords/tags';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { lighten } from 'in-services/formatters/color';
import connectTo from 'in-hoc/connectTo';

import './Tag.less';

const block = 'in-tag';

export default connectTo(
  ({ tag }) => {
    return {
      active: filteredTags$.map(tags => tags.contains(tag.toLowerCase())).startWith(false)
    };
  },
  class extends React.PureComponent {
    static displayName = 'Tag';

    static propTypes = {
      active: rpt.bool,
      tag: rpt.string.isRequired,
      isDark: rpt.bool
    };

    render() {
      const { isDark, active, tag } = this.props;
      const color = getColorPool('tagsNew').getColorHex(tag);

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
        <div className={className} style={{ background: lighten(color, 0.1), color: color }} onClick={this.onClick}>
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
