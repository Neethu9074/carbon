/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { setTagFilter, removeTagFilter, filteredTags$ } from 'in-stores/search/keywords/tags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { lighten } from 'in-services/formatters/color';
import connectTo from 'in-hoc/connectTo';

import './Tag.less';

const block = 'in-tag';

const Tag = ({ tag, active, isDark }) => {
  const { location, navigate } = useNavigation();
  const color = getColorPool('tagsNew').getColorHex(tag);

  let className = block;
  if (active) className += ` ${block}__active`;
  if (isDark) {
    className += ` ${block}__dark`;
    if (active) className += ` ${block}__dark__active`;
  }

  const onClick = () => {
    if (active) {
      removeTagFilter(tag, location, navigate);
    } else {
      setTagFilter(tag, location, navigate);
    }
  };

  return (
    <div className={className} style={{ background: lighten(color, 0.1), color: color }} onClick={onClick}>
      {tag}
    </div>
  );
};

Tag.propTypes = {
  active: rpt.bool,
  tag: rpt.string.isRequired,
  isDark: rpt.bool
};

export default connectTo(
  ({ tag }) => ({
    active: filteredTags$.map(tags => tags.contains(tag.toLowerCase())).startWith(false)
  }),
  Tag
);
