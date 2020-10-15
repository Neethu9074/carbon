import theme from 'in-themes';
import React from 'react';

import KeyEquals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/KeyEquals';
import SimpleValueSelector from 'in-new-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useAutoFocus from 'in-hooks/useAutoFocus';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './TagBasedPayloadConfigurator.mless';

export default React.forwardRef(function TagBasedPayloadConfiguration(
  {
    onChange,
    tagFilterExpression,
    tagCatalog,
    getSuggestions,
    toggle,
    payload: { payloadTagEntity, tagName, secondLevelKey },
    autoFocus
  },
  ref
) {
  const tagNameRef = useAutoFocus({
    fieldsToWatch: [autoFocus]
  });
  const timeConfig = useTimeConfig();
  const secondLevelKeyState = useDebouncedValue(
    secondLevelKey,
    newSecondLevelKey => onChange({ payloadTagEntity, tagName, secondLevelKey: newSecondLevelKey }),
    500
  );

  const tagTreeNode = tagCatalog.tagsByName[tagName];
  const path = tagTreeNode?.path;
  if (!path) {
    // should we show an error or a readonly representation instead of "nothing"
    return null;
  }

  return (
    <div
      className={locals.configurator}
      ref={ref}
      {...toInteractiveElement({
        onDefaultInteraction: toggle
      })}
    >
      <span
        className={locals.tagName}
        ref={autoFocus && tagTreeNode.type !== 'KEY_VALUE_PAIR' ? tagNameRef : undefined}
      >
        {path
          .slice(0, path.length - 1)
          .map(node => node.label)
          .join(' ')}
        <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        {path[path.length - 1].label}
      </span>
      {tagTreeNode.type === 'KEY_VALUE_PAIR' && <KeyEquals />}
      {tagTreeNode.type === 'KEY_VALUE_PAIR' && (
        <SimpleValueSelector
          onChange={secondLevelKeyState.onChange}
          value={secondLevelKeyState.value}
          close={() => {}}
          getSuggestions={() =>
            getSuggestions({
              tagFilterExpression,
              name: tagName,
              entity: payloadTagEntity,
              timeConfig,
              propose: 'KEYS'
            })
          }
          fieldsToWatch={[tagFilterExpression, tagName, payloadTagEntity, timeConfig]}
          inputProps={{
            maxLength: 512,
            type: 'text',
            valid: isNotBlank(secondLevelKeyState.value),
            ref: autoFocus ? tagNameRef : undefined,
            placeholder: 'Key'
          }}
        />
      )}
      <span className={locals.spacer} />
      <Tooltip content="Returns a list of Strings" align="bottomRight">
        <Pill color={theme.lib.colors.navy800}>Strings</Pill>
      </Tooltip>
    </div>
  );
});
