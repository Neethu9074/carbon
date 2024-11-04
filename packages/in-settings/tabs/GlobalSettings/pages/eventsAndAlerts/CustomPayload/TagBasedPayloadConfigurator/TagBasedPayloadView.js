/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { createTagForm, getFormPresentationInformation } from 'in-components/QueryBuilder/validation/tagForm';
import InputValueViewerReadOnly from 'in-components/QueryBuilder/components/Tag/InputValueViewerReadOnly';
import OperatorReadOnly from 'in-components/QueryBuilder/components/Tag/OperatorReadOnly';
import EntityReadOnly from 'in-components/QueryBuilder/components/Tag/EntityReadonly';
import NameReadOnly from 'in-components/QueryBuilder/components/Tag/NameReadOnly';
import useThemedLocals from 'in-hooks/useThemedLocals';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadView.mless';
import styleDefs from 'in-components/QueryBuilder/components/Tag/Tag.mless';

/**
 * While there is no way to avoid to always show an operator, this component was
 * cloning the TagReadOnly component to implement this behavior.
 */
export default function TagBasedPayloadView(props) {
  const { tagCatalog, payloadValue, doesTagNodeNeedSecondLevelKey, hideDestinationSourceTag } = props;
  const element = {
    name: payloadValue.tagName,
    operator: 'EQUALS',
    value: payloadValue.secondLevelKey
  };
  const form = createTagForm(tagCatalog, element);
  const { type: tagType } = getFormPresentationInformation(tagCatalog, form);

  const tagBaseLocals = useThemedLocals(styleDefs);

  return (
    <div className={classNames(tagBaseLocals.tag, locals.main)}>
      {!hideDestinationSourceTag && form.get('entity')?.map(field => <EntityReadOnly entity={field.value} />)}
      <NameReadOnly {...props} element={element} showFullPath={false} />
      {doesTagNodeNeedSecondLevelKey && <OperatorReadOnly element={element} tagType={tagType} />}
      <ValueInput form={form} />
    </div>
  );

  function ValueInput({ form }) {
    const field = form.get('value');
    if (!field) {
      return null;
    }

    return <InputValueViewerReadOnly value={field.value || ''} className={locals.valueField} />;
  }
}
