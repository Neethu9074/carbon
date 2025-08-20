/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Button, TextArea, TextInput } from '@instana/carbon';
import { Result, TagCatalog } from '@instana/types';
import { Card } from '@instana/components';

import BusinessProcessQueryBuilder from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { t } from 'in-i18n';

import local from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

interface NewPerspectiveFormProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  blueprintCatalogResult: Result<TagCatalog>;
}

export function NewPerspectiveForm({ form, updateForm, blueprintCatalogResult }: NewPerspectiveFormProps) {
  // Display loading state
  if (!blueprintCatalogResult || blueprintCatalogResult?.progress?.loading) {
    return null;
  }
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const perspectiveNameField = form.get('perspectiveName');

  return (
    <div className={local.mainDiv}>
      <div className={local.headline}>{t('in-bizops:perspectives.dialog.headline')}</div>
      <div className={local.subtitle}>{t('in-bizops:perspectives.dialog.subtitle')}</div>

      <TextInput
        className={local.textInput}
        id="perspectiveNameInput"
        labelText={t('in-bizops:perspectives.dialog.name')}
        value={perspectiveNameField.value}
        invalid={!perspectiveNameField.valid}
        invalidText={!perspectiveNameField.valid && perspectiveNameField.messages?.[0].message}
        onChange={e =>
          updateForm(form.updateIn(['perspectiveName'], field => field.setValue(e.target.value || '').setTouched(true)))
        }
      />
      <TextArea
        className={local.textArea}
        labelText={t('in-bizops:perspectives.dialog.description')}
        value={form.get('perspectiveDescription').value}
        enableCounter
        maxCount={200}
        onChange={e =>
          updateForm(
            form
              .updateIn(
                ['perspectiveDescription'],
                field => field.setValue((e.target as HTMLTextAreaElement).value) || ''
              )
              .setTouched(true)
          )
        }
      />

      <Card useMaxAvailableHeight={false} className={local.filterCard}>
        <div className={local.filterCardFlex}>
          <div className={local.filterCardHeaderText}>
            <div className={local.headline}>{t('in-bizops:perspectives.dialog.queryHeader')}</div>
            <div className={local.subtitle}>{t('in-bizops:perspectives.dialog.querySubtitle')}</div>
          </div>
          <div className={local.filterCardClear}>
            <Button kind="ghost" size="md" onClick={() => clearTagFilterExpression({ form, updateForm })}>
              {t('in-bizops:perspectives.dialog.queryClear')}
            </Button>
          </div>
        </div>
        <BusinessProcessQueryBuilder
          value={tagFilterExpressionField.value}
          onChange={(tagFilterExpression: any) => setTagFilterExpression({ tagFilterExpression, form, updateForm })}
        />
      </Card>
    </div>
  );
}

interface setTagFilterExpressionProps {
  tagFilterExpression: FormModelElement[];
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

type clearTagFilterExpressionProps = Omit<setTagFilterExpressionProps, 'tagFilterExpression'>;

function setTagFilterExpression({ tagFilterExpression, form, updateForm }: setTagFilterExpressionProps) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}

function clearTagFilterExpression({ form, updateForm }: clearTagFilterExpressionProps) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue([])));
}
