import React from 'react';

import SimpleValueSelector from 'in-new-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import Entity from 'in-new-components/GroupingConfigurator/Entity';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useAutoFocus from 'in-hooks/useAutoFocus';
import SvgIcon from 'in-components/SvgIcon';

import locals from './GroupingConfigurator.mless';

export default React.forwardRef(function ActiveGroupingConfiguration(
  {
    onChange,
    tagFilterExpression,
    tagCatalog,
    getSuggestions,
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
        {tagTreeNode.label}
      </span>

      {tagTreeNode.type === 'KEY_VALUE_PAIR' && (
        <SimpleValueSelector
          onChange={result.onChange}
          value={result.value}
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
            valid: isNotBlank(result.value),
            ref: autoFocus ? tagNameRef : undefined,
            placeholder: 'Key'
          }}
        />
      )}

      <SvgIcon
        className={locals.removeIcon}
        type="lib_openclose_cancel"
        data-test="lib_openclose_cancel"
        onClick={() => onChange(null)}
      />
    </div>
  );
});
