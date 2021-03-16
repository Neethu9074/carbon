/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import EntityIndicator from 'in-analyze/components/EntityIndicator';
import SvgIcon from 'in-components/SvgIcon';

import locals from './TagGroup.mless';

/**
 * Presentation of a tag group.
 * Contains a stylized wrapper showing the entity and name of the tag that is grouped by.
 * If there is a second level key, it is appended to the name.
 * Has a button to remove the entry from the group list (effectively clearing the grouping).
 */
export default function TagGroup({ tagGroupEntry, readonly }) {
  let { groupbyTag, groupbyTagSecondLevelKey, groupbyTagEntity: entity } = tagGroupEntry.tag;

  if (groupbyTagSecondLevelKey) {
    groupbyTag = `${groupbyTag}.${groupbyTagSecondLevelKey}`;
  }

  return (
    <div className={locals.tagGroupWrapper}>
      <div
        className={classNames({
          [locals.tagGroup]: true,
          [locals.readonly]: readonly
        })}
        onClick={tagGroupEntry.onClick}
      >
        <EntityIndicator type={groupbyTag} groupedByEntity={entity} />
        <span className={locals.name}>{groupbyTag}</span>
      </div>

      {!readonly && (
        <SvgIcon
          className={classNames({
            [locals.removeIcon]: true,
            [locals.iconExtraMargin]: false
          })}
          type="lib_openclose_cancel"
          onClick={tagGroupEntry.onRemove}
        />
      )}
    </div>
  );
}
