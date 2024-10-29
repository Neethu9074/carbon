/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { toInteractiveElement, Message, SvgIcon } from '@instana/components';
import { useAutoFocus } from '@instana/hooks';

import { doesTagNodeNeedSecondLevelKey } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import SecondKeyValueSelector from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/SecondKeyValueSelector';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { isNotBlank } from 'in-services/util/string';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './TagBasedPayloadConfigurator.mless';

export default React.forwardRef(function TagBasedPayload(
  {
    onChange,
    tagFilterExpression,
    tagTreeNode,
    getSuggestions,
    suggestionsAlignedLeft,
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
    <div
      className={classNames({
        [locals.configurator]: true,
        [locals.configuratorWithSecondLevelKey]: doesTagNodeNeedSecondLevelKey(tagTreeNode)
      })}
      ref={ref}
      {...interactiveProps}
    >
      <Tooltip
        content={
          <>
            {path
              .slice(0, path.length - 1)
              .map(node => node.label)
              .join(' ')}
            <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
            {path[path.length - 1].label}
          </>
        }
        align="bottomMiddle"
        delay={500}
      >
        <span
          className={locals.tagName}
          ref={autoFocus && !doesTagNodeNeedSecondLevelKey(tagTreeNode) ? tagNameRef : undefined}
        >
          <span>{path.slice(path.length - 2, path.length - 1).map(node => node.label)}</span>
          <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
          {path[path.length - 1].label}
        </span>
      </Tooltip>
      {doesTagNodeNeedSecondLevelKey(tagTreeNode) && (
        <>
          <KeyEquals />
          <div className={locals.keyNameValue}>
            <SecondKeyValueSelector
              onChange={secondLevelKeyState.onChange}
              value={secondLevelKeyState.value}
              valid={isNotBlank(secondLevelKeyState.value)}
              ref={autoFocus ? tagNameRef : undefined}
              autoFocus={autoFocus}
              getSuggestions={() =>
                getSuggestions({
                  tagFilterExpression,
                  name: tagName,
                  timeConfig,
                  propose: 'KEYS'
                })
              }
              alignLeft={suggestionsAlignedLeft}
              fieldsToWatch={[tagFilterExpression, tagName, payloadTagEntity, timeConfig]}
            />
          </div>
        </>
      )}
    </div>
  );
});

export function KeyEquals() {
  return <div className={locals.keyEqualsOperator}>{t('in-settings:tabs.keyEquals')}</div>;
}
