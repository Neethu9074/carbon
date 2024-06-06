/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { isEqual, noop } from 'lodash';

import { Card, Typography, FormGroup, FormLabel, TextInput, Spacer, TextArea, Button } from '@instana/components';

import { BusinessProcessQueryBuilder } from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import createNewPerspectiveForm from 'in-bizops/lists/businessPerspectives/creation/createNewPerspectiveForm';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { PerspectiveFormItem, PerspectiveItem } from 'in-bizops/types';
import { updateBusinessPerspective } from 'in-bizops/api/perspectives';
import { t } from 'in-i18n';

import local from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/perspectiveConfiguration.mless';

interface UpdateProps {
  perspective: PerspectiveFormItem;
  perspectiveId: string;
}

export function Update({ perspective, perspectiveId }: UpdateProps) {
  // Creates and populates a new form with the current perspective details, ready for editing
  const [form, updateForm] = useState(() => createNewPerspectiveForm({ perspective }));

  const nameField = form.get('perspectiveName');
  const descriptionField = form.get('perspectiveDescription');
  const tagFilterExpressionField = form.get('tagFilterExpression');

  // Only enable saving if there are changes between the current config and the user changes
  const configChanged: Boolean =
    !(perspective?.label?.localeCompare(nameField.value) == 0) ||
    !(perspective?.description?.localeCompare(descriptionField.value) == 0) ||
    !isEqual(perspective.tagFilterExpression, tagFilterExpressionField.value);

  const handleUpdateClick = () => {
    const requestBody: PerspectiveItem = {
      id: perspectiveId,
      label: form.get('perspectiveName').value,
      description: form.get('perspectiveDescription').value,
      tagFilterExpression: toBackendQueryModel(form.get('tagFilterExpression').value)
    };
    updateBusinessPerspective(perspectiveId, requestBody).once(noop, noop);
  };

  return (
    <Card
      size="l"
      useMaxAvailableHeight={false}
      hasMarginBottom
      title={t('in-bizops:dashboards.perspectives.configuration.updateCardLabel')}
    >
      <div className={local.cardContents}>
        <Typography variant="body-regular">
          {t('in-bizops:dashboards.perspectives.configuration.stepOneHeader')}
        </Typography>

        <FormGroup className={local.formGroup}>
          <TextInput
            labelText={t('in-bizops:dashboards.perspectives.configuration.perspectiveName')}
            id="perspectiveName"
            value={nameField.value}
            onChange={(e: any) =>
              updateForm(
                form.updateIn(['perspectiveName'], field => field.setValue(e.target.value || '').setTouched(true))
              )
            }
            autoComplete="off"
          />
          <Spacer vertical="normal" />

          <FormLabel>{t('in-bizops:dashboards.perspectives.configuration.perspectiveDescription')}</FormLabel>
          <TextArea
            id="perspectiveDescription"
            carbonVariant
            value={descriptionField.value}
            onChange={(e: any) =>
              updateForm(
                form.updateIn(['perspectiveDescription'], field =>
                  field.setValue(e.target.value || '').setTouched(true)
                )
              )
            }
          />
        </FormGroup>

        <Typography variant="body-regular">
          {t('in-bizops:dashboards.perspectives.configuration.stepTwoHeader')}
        </Typography>

        <div className={local.queryBuilder}>
          <BusinessProcessQueryBuilder
            value={tagFilterExpressionField.value}
            onChange={(tagFilterExpression: any) =>
              updateForm(
                form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression).setTouched(true))
              )
            }
          />
        </div>

        <div className={local.rightJustify}>
          <Button
            className={local.button}
            size="compact"
            kind="create"
            onClick={handleUpdateClick}
            disabled={!configChanged}
          >
            {t('in-bizops:dashboards.perspectives.configuration.saveChangesButton')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
