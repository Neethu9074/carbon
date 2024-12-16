/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useHistory } from 'react-router';
import React, { useState } from 'react';
import { isEqual } from 'lodash';

import { Card, Typography, FormGroup, Spacer, Button, CarbonTextInput, CarbonTextArea } from '@instana/components';

import BusinessProcessQueryBuilder from 'in-bizops/lists/businessPerspectives/components/BusinessProcessQueryBuilder';
import createNewPerspectiveForm from 'in-bizops/lists/businessPerspectives/creation/createNewPerspectiveForm';
import { businessPerspectiveConfigPath, businessPerspectiveDashboard } from 'in-bizops/navigation/paths';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { MAX_DESCRIPTION_SIZE, MAX_NAME_SIZE, TIMEOUT_IN_MS } from 'in-bizops/utils/constants';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { updateBusinessPerspective } from 'in-bizops/api/perspectives';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { PerspectiveItem } from 'in-bizops/utils/types';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

import local from 'in-bizops/dashboards/perspectives/tabs/perspectiveConfiguration/perspectiveConfiguration.mless';

interface UpdateProps {
  perspective: PerspectiveItem;
  updateCount: number;
  setUpdateCount: any;
  perspectiveId: string;
  location: Location;
}

export function Update({ perspective, updateCount, setUpdateCount, perspectiveId, location }: UpdateProps) {
  const history = useHistory();
  // Creates and populates a new form with the current perspective details, ready for editing
  const [form, updateForm] = useState(() => createNewPerspectiveForm({ perspective }));

  const nameField = form.get('perspectiveName');
  const descriptionField = form.get('perspectiveDescription');
  const tagFilterExpressionField = form.get('tagFilterExpression');

  // Only enable saving if there are changes between the current config and the user changes,
  // and the updates are valid
  const formChanges: Boolean =
    !isEqual(perspective?.name, nameField.value) ||
    !isEqual(perspective?.description, descriptionField.value) ||
    !isEqual(perspective.tagFilterExpression, tagFilterExpressionField.value);
  const enableSave: Boolean = formChanges && form.hierarchyValid;

  function refreshPage(target: Location): void {
    history.replace(target);
  }

  const handleUpdateClick = () => {
    const requestBody: PerspectiveItem = {
      id: perspectiveId,
      name: form.get('perspectiveName').value,
      description: form.get('perspectiveDescription').value,
      tagFilterExpression: toBackendQueryModel(form.get('tagFilterExpression').value)
    };
    updateBusinessPerspective(perspectiveId, requestBody).once(
      data => {
        location.pathname = `${businessPerspectiveConfigPath}`;
        setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveId', data.id);
        setOrDeleteMatrixKey(location, businessPerspectiveDashboard, 'perspectiveName', data.name);
        setUpdateCount(updateCount + 1);
        refreshPage(location);
        addMessage({
          type: 'info',
          title: t('in-bizops:dashboards.perspectives.configuration.businessPerspectiveUpdated'),
          content: t('in-bizops:dashboards.perspectives.configuration.businessPerspectiveUpdatedDetails', {
            perspectiveName: data.name
          }),
          timeout: TIMEOUT_IN_MS
        });
      },
      error => {
        addMessage({
          type: 'danger',
          title: t('in-bizops:dashboards.perspectives.configuration.error'),
          content: error.message,
          timeout: TIMEOUT_IN_MS
        });
      }
    );
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
          <CarbonTextInput
            labelText={t('in-bizops:dashboards.perspectives.configuration.perspectiveName')}
            id="perspectiveName"
            value={nameField.value}
            enableCounter
            maxCount={MAX_NAME_SIZE}
            onChange={(e: any) =>
              updateForm(
                form.updateIn(['perspectiveName'], field => field.setValue(e.target.value || '').setTouched(true))
              )
            }
            autoComplete="off"
            warn={nameField.touched && !nameField.valid}
            warnText={nameField.messages[0]?.message}
          />
          <Spacer vertical="normal" />

          <CarbonTextArea
            id="perspectiveDescription"
            labelText={t('in-bizops:dashboards.perspectives.configuration.perspectiveDescription')}
            enableCounter
            maxCount={MAX_DESCRIPTION_SIZE}
            value={descriptionField.value}
            onChange={(e: any) =>
              updateForm(
                form.updateIn(['perspectiveDescription'], field =>
                  field.setValue(e.target.value || '').setTouched(true)
                )
              )
            }
            warn={descriptionField.touched && !descriptionField.valid}
            warnText={descriptionField.messages[0]?.message}
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
            disabled={!enableSave}
          >
            {t('in-bizops:dashboards.perspectives.configuration.saveChangesButton')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
