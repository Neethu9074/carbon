/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { form$, setValue, save, error$ } from 'in-components/SearchBar/stores/dialog';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './SaveDialog.less';

const block = 'in-search-save-dialog';

export default connectTo(
  {
    form: form$,
    error: error$
  },
  function SaveDialog({ form, error }) {
    return (
      <Dialog title={t('in-components:searchBar.saveDialogSaveFilterTitle')} onClose={close}>
        <form onSubmit={onSubmit}>
          {form.get('name').map(field => (
            <FormGroup>
              <Label htmlFor="filter-name">{t('in-components:searchBar.saveDialogNameLabel')}</Label>
              <Input
                type="text"
                id="filter-name"
                value={field.value}
                onChange={e => setValue('name', e.target.value)}
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

          {form.get('definition').map(field => (
            <FormGroup>
              <Label htmlFor="filter-definition">{t('in-components:searchBar.saveDialogDefinitionLabel')}</Label>
              <Input
                type="text"
                id="filter-definition"
                value={field.value}
                onChange={e => setValue('definition', e.target.value)}
                hasError={!field.valid}
              />
              {field.messages.map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
            </FormGroup>
          ))}

          <div className={`${block}__actions`}>
            <Button disabled={!form.valid} type="submit">
              {t('in-components:searchBar.saveDialogSaveFilterBtn')}
            </Button>
            {error ? <div className={`${block}__error`}>{error}</div> : null}
          </div>
        </form>
      </Dialog>
    );

    function onSubmit(e) {
      e.preventDefault();

      if (form.hierarchyValid) {
        save();
      }
    }
  }
);
