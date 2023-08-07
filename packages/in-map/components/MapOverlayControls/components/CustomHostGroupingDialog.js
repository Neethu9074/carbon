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
import { t, Trans } from 'in-i18n';

import locals from './CustomHostGroupingDialog.mless';

const initialForm = createMapForm().put(
  'prefix',
  createField({
    value: '',
    validator: notBlankValidator
  })
);

export default function CustomHostGroupingDialog() {
  const [form, setForm] = useState(initialForm);

  const setCurrentViewWithViewGrouping = useSetCurrentViewWithViewGrouping();

  function onChange(fieldName, value) {
    setForm(form.updateIn([fieldName], field => field.setValue(value).setTouched(true)));
  }

  function onSubmit(e) {
    e.preventDefault();

    if (form.hierarchyValid) {
      setCurrentViewWithViewGrouping('vg-i', `custom-${form.get('prefix').value}`);
      close();
    }
  }

  return (
    <Dialog title={t('in-map:customGroupingUsingTagPrefix')} onClose={close} className={locals.dialog}>
      <p>
        <Trans
          i18nKey="in-map:customGroupingExample"
          components={{
            code: <code />
          }}
        />
      </p>

      <form onSubmit={e => onSubmit(e)}>
        {form.get('prefix').map(field => (
          <FormGroup>
            <Label htmlFor="grouping-tag-prefix">{t('in-map:tagPrefix')}</Label>
            <Input
              type="text"
              id="grouping-tag-prefix"
              value={field.value}
              onChange={e => onChange('prefix', e.target.value)}
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
