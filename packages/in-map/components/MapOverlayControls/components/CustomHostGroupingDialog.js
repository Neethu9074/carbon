/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React from 'react';

import { setCurrentViewWithViewGrouping } from 'in-stores/navigation/paths/mainPaths';
import { notBlankValidator } from 'in-services/validators/string';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t, Trans } from 'in-i18n';

import locals from './CustomHostGroupingDialog.mless';

export default class CustomHostGroupingDialog extends React.Component {
  state = {
    form: createMapForm().put(
      'prefix',
      createField({
        value: '',
        validator: notBlankValidator
      })
    )
  };

  render() {
    const form = this.state.form;

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

        <form onSubmit={this.onSubmit}>
          {form.get('prefix').map(field => (
            <FormGroup>
              <Label htmlFor="grouping-tag-prefix">{t('in-map:tagPrefix')}</Label>
              <Input
                type="text"
                id="grouping-tag-prefix"
                value={field.value}
                onChange={e => this.onChange('prefix', e.target.value)}
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

  onChange = (fieldName, value) => {
    this.setState({
      form: this.state.form.updateIn([fieldName], field => field.setValue(value).setTouched(true))
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if (this.state.form.hierarchyValid) {
      setCurrentViewWithViewGrouping('vg-i', `custom-${this.state.form.get('prefix').value}`);
      close();
    }
  };
}
