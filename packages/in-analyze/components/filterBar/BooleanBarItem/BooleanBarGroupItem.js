/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';

/**
 * A clickable item to toggle groups.
 * Clicking on one sets this one as a group, or disables grouping if it was already active.
 */
export default function BooleanBarGroupItem(props) {
  const { singularLabel, refSetter, clearTagGroup, tag, activeTagGroup, setTagGroup, entity } = props;

  const active = activeTagGroup?.groupbyTag === tag;

  const toggleFilter = () => {
    if (active) {
      clearTagGroup();
    } else {
      setTagGroup({
        groupbyTag: tag,
        groupbyTagEntity: entity
      });
    }
  };

  return (
    <BarItem isOpen={false} active={active} onClick={toggleFilter} refSetter={refSetter}>
      {singularLabel}
    </BarItem>
  );
}
