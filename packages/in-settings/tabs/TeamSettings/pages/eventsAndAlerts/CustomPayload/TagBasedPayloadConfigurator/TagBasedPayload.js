/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { toInteractiveElement, Message, SvgIcon } from '@instana/components';
import { useAutoFocus } from '@instana/hooks';

import { doesTagNodeNeedSecondLevelKey } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import KeyEquals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/KeyEquals';
import SimpleValueSelector from 'in-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './TagBasedPayloadConfigurator.mless';

export default React.forwardRef(function TagBasedPayloadConfiguration(
  {
    onChange,
    tagFilterExpression,
    tagTreeNode,
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

  const path = tagTreeNode?.path;
  if (!path) {
    return (
      <Message type="error" small>
        {t('in-settings:tabs.team.customPayload.unknownTag', { tagName })}
      </Message>
    );
  }

  const interactiveProps = toInteractiveElement({
    onDefaultInteraction: toggle
  });

  return (
    <div className={locals.configurator} ref={ref} {...interactiveProps}>
      <span
        className={locals.tagName}
        ref={autoFocus && !doesTagNodeNeedSecondLevelKey(tagTreeNode) ? tagNameRef : undefined}
      >
        {path
          .slice(0, path.length - 1)
          .map(node => node.label)
          .join(' ')}
        <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        {path[path.length - 1].label}
      </span>
      {doesTagNodeNeedSecondLevelKey(tagTreeNode) && (
        <>
          <KeyEquals />
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
        </>
      )}
      <span className={locals.spacer} />
    </div>
  );
});
