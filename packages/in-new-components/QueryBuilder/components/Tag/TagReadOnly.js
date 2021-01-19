/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { createTagForm, getFormPresentationInformation } from 'in-new-components/QueryBuilder/validation/tagForm';
import InputValueViewerReadOnly from './InputValueViewerReadOnly';
import useThemedLocals from 'in-hooks/useThemedLocals';
import OperatorReadOnly from './OperatorReadOnly';
import EntityReadOnly from './EntityReadonly';
import NameReadOnly from './NameReadOnly';

import styleDefs from './Tag.mless';

export default function TagReadOnly(props) {
  const { tagCatalog, element } = props;
  const form = createTagForm(tagCatalog, element);
  const { type: tagType } = getFormPresentationInformation(tagCatalog, form);

  const locals = useThemedLocals(styleDefs);

  return (
    <div className={locals.tag} style={{ cursor: 'not-allowed' }}>
      {form.get('entity')?.map(field => (
        <EntityReadOnly entity={field.value} />
      ))}
      <NameReadOnly {...props} />
      <KeyInput form={form} />
      <OperatorReadOnly element={element} tagType={tagType} />
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
