import classNames from 'classnames';
import React from 'react';

import SimpleValueSelector from 'in-new-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import Entity from 'in-new-components/GroupingConfigurator/Entity';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useAutoFocus from 'in-hooks/useAutoFocus';
import SvgIcon from 'in-components/SvgIcon';

import locals from './GroupingConfigurator.mless';

export default React.forwardRef(function ActiveGroupingConfiguration(
  {
    tagFilterExpression,
    tagCatalog,
    getSuggestions,
    onChange,
    onGroupRemoved,
    toggle,
    group: { groupbyTagEntity, groupbyTag, groupbyTagSecondLevelKey },
    autoFocus
  },
  ref
) {
  const tagNameRef = useAutoFocus({
    fieldsToWatch: [autoFocus]
  });
  const timeConfig = useTimeConfig();
  const result = useDebouncedValue(
    groupbyTagSecondLevelKey,
    v => onChange({ groupbyTagEntity, groupbyTag, groupbyTagSecondLevelKey: v }),
    500
  );

  const tagTreeNode = tagCatalog.tagsByName[groupbyTag];
  const path = tagTreeNode?.path;

  if (!path) {
    return null;
  }

  return (
    <div className={locals.groupingConfigurator} ref={ref}>
      {tagTreeNode.canApplyToSource && tagTreeNode.canApplyToDestination && (
        <Entity
          groupbyTagEntity={groupbyTagEntity}
          onChange={groupbyTagEntity => onChange({ groupbyTagEntity, groupbyTag, groupbyTagSecondLevelKey })}
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
        <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        {path[path.length - 1].label}
      </span>

      {tagTreeNode.type === 'KEY_VALUE_PAIR' && (
        <>
          <span className={locals.operator}>=</span>

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
                propose: 'KEYS'
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
        </>
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
