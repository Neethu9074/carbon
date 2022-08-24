/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { createTagForm, getFormPresentationInformation } from 'in-components/QueryBuilder/validation/tagForm';
import InputValueViewerReadOnly from 'in-components/QueryBuilder/components/Tag/InputValueViewerReadOnly';
import OperatorReadOnly from 'in-components/QueryBuilder/components/Tag/OperatorReadOnly';
import EntityReadOnly from 'in-components/QueryBuilder/components/Tag/EntityReadonly';
import NameReadOnly from 'in-components/QueryBuilder/components/Tag/NameReadOnly';
import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from 'in-components/QueryBuilder/components/Tag/Tag.mless';

/**
 * While there is no way to avoid to always show an operator, this component was
 * cloning the TagReadOnly component to implement this behavior.
 *
 * TODO: as a follow-up, let's extend either the readonly-view of the QueryBuilder or
 * extend the TagReadOnly view to make it reuse-able for our purpose.
 */
export default function TagBasedPayloadView(props) {
  const { tagCatalog, payloadValue, doesTagNodeNeedSecondLevelKey } = props;
  const element = {
    name: payloadValue.tagName,
    operator: 'EQUALS',
    value: payloadValue.secondLevelKey
  };
  const form = createTagForm(tagCatalog, element);
  const { type: tagType } = getFormPresentationInformation(tagCatalog, form);

  const locals = useThemedLocals(styleDefs);

  return (
    <div className={locals.tag} style={{ cursor: 'not-allowed' }}>
      {form.get('entity')?.map(field => (
        <EntityReadOnly entity={field.value} />
      ))}
      <NameReadOnly {...props} element={element} />
      <KeyInput form={form} />
      {doesTagNodeNeedSecondLevelKey && <OperatorReadOnly element={element} tagType={tagType} />}
      <ValueInput form={form} />
    </div>
  );

  function KeyInput({ form }) {
    const field = form.get('key');
    if (!field) {
      return null;
    }

    return <InputValueViewerReadOnly value={field.value || ''} />;
  }

  function ValueInput({ form }) {
    const field = form.get('value');
    if (!field) {
      return null;
    }

    return <InputValueViewerReadOnly value={field.value || ''} />;
  }
}
