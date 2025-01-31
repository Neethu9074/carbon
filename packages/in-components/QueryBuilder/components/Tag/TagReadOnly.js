/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { createTagForm, getFormPresentationInformation } from 'in-components/QueryBuilder/validation/tagForm';
import InputValueViewerReadOnly from 'in-components/QueryBuilder/components/Tag/InputValueViewerReadOnly';
import OperatorReadOnly from 'in-components/QueryBuilder/components/Tag/OperatorReadOnly';
import EntityReadOnly from 'in-components/QueryBuilder/components/Tag/EntityReadonly';
import NameReadOnly from 'in-components/QueryBuilder/components/Tag/NameReadOnly';
import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './Tag.mless';

export default function TagReadOnly(props) {
  const { tagCatalog, element } = props;
  const form = createTagForm(tagCatalog, element);
  const { type: tagType } = getFormPresentationInformation(tagCatalog, form);

  const locals = useThemedLocals(styleDefs);
  return (
    <div className={classNames({ [locals.tag_disablehover]: true })}>
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

    return <InputValueViewerReadOnly value={field.value ?? ''} />;
  }
}
