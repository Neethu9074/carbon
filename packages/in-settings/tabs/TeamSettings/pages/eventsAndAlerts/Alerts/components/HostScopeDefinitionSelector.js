/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import OperatorSelectorOverlay from 'in-components/QueryBuilder/OperatorSelectorOverlay/OperatorSelectorOverlay';
import * as typeToOperatorsMapping from 'in-components/QueryBuilder/tagFilter/typeToOperatorsMapping';
import SimpleValueSelector from 'in-components/QueryBuilder/SimpleValueSelector/SimpleValueSelector';
import * as operatorLabels from 'in-components/QueryBuilder/tagFilter/operatorLabelsMapping';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { isNotBlank } from 'in-services/util/string';
import Overlay from 'in-components/overlays/Overlay';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/HostScopeDefinitionSelector.mless';

export default React.forwardRef(function HostScopeDefinitionSelector(
  { tagTreeNode, getSuggestions, tagValueField, setTagValue, operator, setOperator, handleCancel },
  ref
) {
  const timeConfig = useTimeConfig();
  const infraTagKeyValueState = useDebouncedValue(tagValueField?.value ?? '', setTagValue, 500);

  const tagName = tagTreeNode?.name ?? '';
  const path = tagTreeNode?.path ?? [];

  return (
    <div className={locals.configurator} ref={ref}>
      <span className={locals.tagName}>
        {path
          .slice(0, path.length - 1)
          .map(node => node.label)
          .join(' ')}
        <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        {path[path.length - 1].label}
      </span>

      <Operator
        operator={operator}
        allowedOperators={typeToOperatorsMapping[tagTreeNode?.type ?? 'STRING']}
        tagType={tagTreeNode?.type ?? 'STRING'}
        onChange={setOperator}
      />

      <RenderSimpleValueSelector
        tagValueField={tagValueField}
        infraTagKeyValueState={infraTagKeyValueState}
        getSuggestions={getSuggestions}
        tagName={tagName}
        timeConfig={timeConfig}
      />

      <div
        className={classNames({
          [locals.removeIconContainer]: Boolean(tagValueField)
        })}
      >
        <SvgIcon
          className={locals.removeIcon}
          type="lib_openclose_cancel"
          data-test="lib_openclose_cancel"
          onClick={handleCancel}
        />
      </div>
    </div>
  );
});

function RenderSimpleValueSelector({ tagValueField, infraTagKeyValueState, getSuggestions, tagName, timeConfig }) {
  if (tagValueField) {
    return (
      <SimpleValueSelector
        onChange={infraTagKeyValueState.onChange}
        value={infraTagKeyValueState.value}
        close={() => {}}
        getSuggestions={() =>
          getSuggestions({
            name: tagName,
            value: infraTagKeyValueState.value,
            timeConfig
          })
        }
        fieldsToWatch={[infraTagKeyValueState, tagName, timeConfig]}
        inputProps={{
          maxLength: 512,
          type: 'text',
          valid: isNotBlank(infraTagKeyValueState.value),
          placeholder: t('in-settings:tabs.hostsByTag.value'),
          hideValidityInformationOnFocus: true
        }}
      />
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
      {({ toggle, ref }) => (
        <div className={locals.operator} onClick={toggle} ref={ref}>
          {operatorLabels[`${tagType}_${operator}`]}
        </div>
      )}
    </Overlay>
  );
}
