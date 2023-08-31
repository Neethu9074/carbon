/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import rpt from 'prop-types';

import { Button } from '@instana/components';

import ActiveGroupingConfiguration from 'in-components/GroupingConfigurator/ActiveGroupingConfiguration';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { DESTINATION, SOURCE } from 'in-components/QueryBuilder/tagFilter/entities';
import LoadingIndicator from 'in-components/GroupingConfigurator/LoadingIndicator';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './GroupingConfigurator.mless';

export default function GroupingConfigurator({
  value,
  tagFilterExpression,
  tagCatalog,
  getSuggestions,
  onChange,
  tracking,
  label = t('in-components:groupingConfigurator.addGroup'),
  loadingLabel
}) {
  const autoFocus = useRef();

  const multipleGroupsSupported = Array.isArray(value);
  const groups = useMemo(
    () => (multipleGroupsSupported ? value : [value]).filter(group => group?.groupbyTag),
    [value, multipleGroupsSupported]
  );
  const changeGroup = useCallback(
    (group, index) => {
      if (multipleGroupsSupported) {
        const prevIndex = groups.findIndex(existingGroup => isEqual(existingGroup, group));
        const newGroups = groups.slice();
        const oldGroup = newGroups[index];
        newGroups[index] = group;
        if (prevIndex >= 0) {
          newGroups[prevIndex] = oldGroup; // swap groups if this group was already there
        }
        onChange(newGroups.filter(existingGroup => existingGroup?.groupbyTag));
      } else {
        onChange(group);
      }
    },
    [groups, onChange, multipleGroupsSupported]
  );
  const addGroup = useCallback(
    group => {
      if (multipleGroupsSupported) {
        const newGroups = groups.filter(existingGroup => !isEqual(existingGroup, group)); // remove the group if it's already selected
        newGroups.push(group);
        onChange(newGroups.filter(existingGroup => existingGroup?.groupbyTag));
      } else {
        onChange(group);
      }
    },
    [groups, onChange, multipleGroupsSupported]
  );

  if (!tagCatalog) {
    return <LoadingIndicator text={loadingLabel} />;
  }

  const maxLength = multipleGroupsSupported ? 5 : 1;

  return (
    <div className={locals.container}>
      {groups.map((group, i) => {
        const onChange = group => changeGroup(group, i);
        return (
          <GroupingOverlay
            key={i}
            tagCatalog={tagCatalog}
            autoFocus={autoFocus}
            onChange={onChange}
            tracking={tracking}
          >
            {({ toggle, refSetter }) => (
              <ActiveGroupingConfiguration
                onChange={onChange}
                onGroupRemoved={tracking?.onGroupRemoved}
                getSuggestions={getSuggestions}
                group={group}
                toggle={toggle}
                ref={refSetter}
                tagCatalog={tagCatalog}
                tagFilterExpression={tagFilterExpression}
                autoFocus={autoFocus.current}
              />
            )}
          </GroupingOverlay>
        );
      })}
      {groups.length < maxLength && (
        <GroupingOverlay tagCatalog={tagCatalog} autoFocus={autoFocus} onChange={addGroup} tracking={tracking}>
          {({ toggle, refSetter }) => (
            <Button
              className={locals.addGroupingButton}
              kind="subtle"
              size="compact"
              icon="lib_openclose_add"
              refSetter={refSetter}
              onClick={toggle}
            >
              {label}
            </Button>
          )}
        </GroupingOverlay>
      )}
    </div>
  );
}

export const trackingProps = {
  onGroupAdded: rpt.func,
  onGroupRemoved: rpt.func
};

function GroupingOverlay({ tagCatalog, autoFocus, children, onChange, tracking }) {
  return (
    <Overlay
      content={TagSelectorOverlay}
      props={{
        tagCatalog,
        onChange: ({ name, tagType }) => {
          autoFocus.current = Date.now();
          const selectedGroup = setEntityIfNecessary(name, tagType);
          tracking?.onGroupAdded?.(selectedGroup);
          onChange(selectedGroup);
        }
      }}
      align={'bottomLeft'}
      withoutWrapper
    >
      {children}
    </Overlay>
  );

  function setEntityIfNecessary(groupbyTag, tagType) {
    const tagTreeNode = tagCatalog?.tagsByName[groupbyTag];
    if (tagTreeNode.canApplyToSource || tagTreeNode.canApplyToDestination) {
      return {
        groupbyTag,
        groupbyTagEntity: tagTreeNode.canApplyToDestination ? DESTINATION : SOURCE
      };
    }

    return { groupbyTag, tagType };
  }
}

GroupingConfigurator.propTypes = {
  onChange: rpt.func.isRequired,
  value: rpt.oneOfType([rpt.array, rpt.object]),
  tagCatalog: rpt.object,
  getSuggestions: rpt.func.isRequired,
  tagFilterExpression: rpt.oneOfType([rpt.array, rpt.object]),
  tracking: rpt.shape(trackingProps),
  label: rpt.string,
  loadingLabel: rpt.string
};
