/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer, FormGroup, CarbonTextArea, CarbonTextInput } from '@instana/components';
import { Result, TagCatalog, TimeConfig } from '@instana/types';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ProcessesLiveList from 'in-bizops/lists/businessPerspectives/creation/ProcessesLiveList';
import { MAX_DESCRIPTION_SIZE, MAX_NAME_SIZE } from 'in-bizops/utils/constants';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

interface NewPerspectiveFormStepTwoProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  blueprintCatalogResult: Result<TagCatalog>;
  timeConfig: TimeConfig;
}

export function NewPerspectiveFormStepTwo({
  form,
  updateForm,
  blueprintCatalogResult,
  timeConfig
}: NewPerspectiveFormStepTwoProps) {
  const perspectiveNameField = form.get('perspectiveName');
  const perspectiveDescription = form.get('perspectiveDescription');

  return (
    <SimpleModeStepContentWrapper headline={t('in-bizops:perspectives.dialog.stepTwo.headline')}>
      <div className={locals.contentParent}>
        <FormGroup className={locals.leftContent}>
          <CarbonTextInput
            id="perspectiveName"
            labelText={t('in-bizops:perspectives.dialog.stepTwo.perspectiveName')}
            value={perspectiveNameField.value}
            enableCounter
            maxCount={MAX_NAME_SIZE}
            onChange={(e: any) =>
              updateForm(
                form.updateIn(['perspectiveName'], field => field.setValue(e.target.value || '').setTouched(true))
              )
            }
            autoComplete="off"
            invalid={perspectiveNameField.touched && !perspectiveNameField.valid}
            invalidText={perspectiveNameField.messages[0]?.message}
          />
          <Spacer vertical="normal" />

          <CarbonTextArea
            id="perspectiveDescription"
            labelText={t('in-bizops:perspectives.dialog.stepTwo.perspectiveDescription')}
            className={locals.leftContent}
            enableCounter
            maxCount={MAX_DESCRIPTION_SIZE}
            value={perspectiveDescription.value}
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
            warn={perspectiveDescription.touched && !perspectiveDescription.valid}
            warnText={perspectiveDescription.messages[0]?.message}
          />
        </FormGroup>
        <div className={locals.rightContent}>
          <ProcessesLiveList
            tagFilterExpressionFormModel={form.get('tagFilterExpression').value}
            blueprintCatalogResult={blueprintCatalogResult}
            timeConfig={timeConfig}
          />
        </div>
      </div>
    </SimpleModeStepContentWrapper>
  );
}
