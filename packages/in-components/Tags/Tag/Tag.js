/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { setTagFilter, removeTagFilter } from 'in-stores/search/keywords/tags';
import { getColorPool } from 'in-services/util/ColorGenerator';

import './Tag.less';

const block = 'in-tag';

export default function Tag({ active, tag, isDark }) {
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
    <div className={className} style={{ borderLeft: `3px solid ${color}` }} onClick={onClick}>
      {tag}
    </div>
  );

  function onClick() {
    if (active) {
      removeTagFilter(tag);
    } else {
      setTagFilter(tag);
    }
  }
}

Tag.propTypes = {
  active: rpt.bool,
  tag: rpt.string.isRequired,
  isDark: rpt.bool
};
