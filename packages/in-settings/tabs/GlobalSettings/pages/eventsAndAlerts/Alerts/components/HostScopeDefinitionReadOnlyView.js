/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import OperatorSelectorOverlay from 'in-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';
import * as operatorLabels from 'in-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import { isNotBlank } from 'in-services/util/string';
import Overlay from 'in-components/overlays/Overlay';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/HostScopeDefinitionSelector.mless';
import simpleSelectorLocals from 'in-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector.mless';

export default React.forwardRef(function HostScopeDefinitionReadOnlyView(
  { tagTreeNode, tagValueField, operator },
  ref
) {
  const infraTagKeyValueState = tagValueField?.value;
  const path = tagTreeNode?.path ?? [];

  return (
    <div className={classNames(locals.configurator, locals.disabled)} ref={ref}>
      <span className={locals.tagName}>
        {path
          .slice(0, path.length - 1)
          .map(node => node.label)
          .join(' ')}
        <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        {path[path.length - 1]?.label}
      </span>

      <Operator operator={operator} tagType={tagTreeNode?.type ?? 'STRING'} disabled />

      <RenderSimpleValueSelector tagValueField={tagValueField} infraTagKeyValueState={infraTagKeyValueState} />
    </div>
  );
});

function RenderSimpleValueSelector({ tagValueField, infraTagKeyValueState }) {
  if (tagValueField) {
    return (
      <Tooltip content={infraTagKeyValueState} align={'topMiddle'} delay={300}>
        {/*This div is used to attach the tooltip to AutosizeInput*/}
        {/*We do not want to mess with passing refs down to 3rd party dependencies which could possible break in the future,*/}
        {/*so we're using this workaround*/}
        <div>
          <AutosizeInput
            value={infraTagKeyValueState}
            minWidth={32}
            inputClassName={classNames(simpleSelectorLocals.input, locals.disabledTagInput)}
            maxLength={512}
            type="text"
            valid={isNotBlank(infraTagKeyValueState)}
            placeholder={t('in-settings:tabs.hostsByTag.value')}
            hideValidityInformationOnFocus
          />
        </div>
      </Tooltip>
    );
  }

  return null;
}

function Operator({ operator, allowedOperators, tagType, onChange }) {
  return (
    <Overlay
      withoutWrapper
      content={OperatorSelectorOverlay}
      props={{ value: operator, onChange, allowedOperators, tagType }}
      align="topMiddle"
    >
      {({ ref }) => (
        <div className={classNames(locals.operator, locals.disabled)} ref={ref}>
          {operatorLabels[`${tagType}_${operator}`]}
        </div>
      )}
    </Overlay>
  );
}
