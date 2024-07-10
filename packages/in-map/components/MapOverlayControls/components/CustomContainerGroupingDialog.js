/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { Button } from '@instana/components';

import { useSetCurrentViewWithViewGrouping } from 'in-stores/navigation/paths/mainPaths';
import { notBlankValidator } from 'in-services/validators/string';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import FormGroup from 'in-components/form/FormGroup';
import Dialog from 'in-components/Dialog/Dialog';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

const initialForm = createMapForm().put(
  'path',
  createField({
    value: '',
    validator: notBlankValidator
  })
);

export default function CustomContainerGroupingDialog() {
  const [form, setForm] = useState(initialForm);
  const setCurrentViewWithViewGrouping = useSetCurrentViewWithViewGrouping();

  function onSubmit(e) {
    e.preventDefault();

    if (form.hierarchyValid) {
      setCurrentViewWithViewGrouping('vg-c', `custom-${form.get('path').value}`);
      close();
    }
  }

  function onChange(fieldName, value) {
    setForm(form.updateIn([fieldName], field => field.setValue(value).setTouched(true)));
  }

  return (
    <Dialog title={t('in-map:customGrouping')} onClose={close}>
      <form onSubmit={e => onSubmit(e)}>
        {form.get('path').map(field => (
          <FormGroup>
            <Label htmlFor="grouping-path">{t('in-map:groupBy')}</Label>
            <Input
              type="text"
              id="grouping-path"
              value={field.value}
              onChange={e => onChange('path', e.target.value)}
              hasError={!field.valid}
              autoFocus
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}

        <Button disabled={!form.valid} type="submit">
          {t('in-map:applyGrouping')}
        </Button>
      </form>
    </Dialog>
  );
}
