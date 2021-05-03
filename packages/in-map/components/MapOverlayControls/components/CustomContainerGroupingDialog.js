/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

import { setCurrentViewWithViewGrouping } from 'in-stores/navigation/paths/mainPaths';
import { notBlankValidator } from 'in-services/validators/string';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

export default class CustomContainerGroupingDialog extends React.Component {
  state = {
    form: createMapForm().put(
      'path',
      createField({
        value: '',
        validator: notBlankValidator
      })
    )
  };

  render() {
    const form = this.state.form;

    return (
      <Dialog title={t('in-map:customGrouping')} onClose={close}>
        <form onSubmit={this.onSubmit}>
          {form.get('path').map(field => (
            <FormGroup>
              <Label htmlFor="grouping-path">{t('in-map:groupBy')}</Label>
              <Input
                type="text"
                id="grouping-path"
                value={field.value}
                onChange={e => this.onChange('path', e.target.value)}
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
      setCurrentViewWithViewGrouping('vg-c', `custom-${this.state.form.get('path').value}`);
      close();
    }
  };
}
