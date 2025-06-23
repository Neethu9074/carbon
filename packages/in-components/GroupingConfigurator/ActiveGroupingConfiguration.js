/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { toInteractiveElement } from '@instana/components';
import { useAutoFocus } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import SimpleValueSelector from 'in-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import Entity from 'in-components/GroupingConfigurator/Entity';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './GroupingConfigurator.mless';

export default React.forwardRef(function ActiveGroupingConfiguration(
  {
    tagFilterExpression,
    tagCatalog,
    getSuggestions,
    getSuggestionsProps,
    onChange,
    onGroupRemoved,
    toggle,
    group: { groupbyTagEntity, groupbyTag, groupbyTagSecondLevelKey, tagDefinition },
    autoFocus,
    disableEntitySelection
  },
  ref
) {
  const tagNameRef = useAutoFocus({
    fieldsToWatch: [autoFocus]
  });
  const timeConfig = useTimeConfig();

  const tagTreeNode = getTagTreeNode({ groupbyTag, groupbyTagSecondLevelKey, tagCatalog, tagDefinition });

  const result = useDebouncedValue(
    groupbyTagSecondLevelKey,
    v => onChange({ groupbyTagEntity, groupbyTag, groupbyTagSecondLevelKey: v, tagType: tagTreeNode.type }),
    500
  );

  const path = tagTreeNode?.path;

  if (!path) {
    return null;
  }

  return (
    <div className={locals.groupingConfigurator} ref={ref}>
      {!disableEntitySelection && (tagTreeNode.canApplyToSource || tagTreeNode.canApplyToDestination) && (
        <Entity
          groupbyTagEntity={groupbyTagEntity}
          onChange={groupbyTagEntity => onChange({ groupbyTagEntity, groupbyTag, groupbyTagSecondLevelKey })}
          sourceEnabled={tagTreeNode.canApplyToSource}
          destinationEnabled={tagTreeNode.canApplyToDestination}
        />
      )}

      <span
        className={locals.groupName}
        {...toInteractiveElement({
          onDefaultInteraction: toggle
        })}
        ref={autoFocus && tagTreeNode.type !== 'KEY_VALUE_PAIR' ? tagNameRef : undefined}
      >
        {path
          .slice(0, path.length - 1)
          .map(node => node.label)
          .join(' ')}
        {path.length > 1 && <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />}
        {path[path.length - 1].label}
      </span>

      {(tagTreeNode.type === 'KEY_VALUE_PAIR' || tagTreeNode.type === 'KEY_NUMBER_PAIR') && (
        <div className={locals.key}>
          <SimpleValueSelector
            onChange={result.onChange}
            value={result.value || ''}
            close={() => {}}
            getSuggestions={() =>
              getSuggestions({
                tagFilterExpression,
                name: groupbyTag,
                entity: groupbyTagEntity,
                timeConfig,
                propose: 'KEYS',
                ...getSuggestionsProps
              })
            }
            fieldsToWatch={[tagFilterExpression, groupbyTag, groupbyTagEntity, timeConfig]}
            inputProps={{
              type: 'text',
              // key value pairs can be grouped by without a key
              valid: true,
              ref: autoFocus ? tagNameRef : undefined,
              placeholder: 'Key'
            }}
          />
        </div>
      )}

      <div
        className={classNames({
          [locals.removeIconContainer]: true,
          [locals.nextToKey]: tagTreeNode.type === 'KEY_VALUE_PAIR'
        })}
      >
        <SvgIcon
          className={locals.removeIcon}
          type="lib_openclose_cancel"
          data-test="lib_openclose_cancel"
          onClick={() => {
            onChange(null);
            onGroupRemoved?.({ groupbyTagEntity, groupbyTag, groupbyTagSecondLevelKey });
          }}
        />
      </div>
    </div>
  );
});

// if a tag is no longer available, we need to still show an editable field
function getTagTreeNode({ groupbyTag, groupbyTagSecondLevelKey, tagCatalog, tagDefinition }) {
  const fallbackTag = groupbyTag + '.' + groupbyTagSecondLevelKey;

  return (
    tagDefinition ??
    tagCatalog.tagsByName[groupbyTag] ??
    tagCatalog.tagsByName[fallbackTag] ?? {
      type: 'STRING',
      path: fallbackTag.split('.').map(label => ({ label }))
    }
  );
}
