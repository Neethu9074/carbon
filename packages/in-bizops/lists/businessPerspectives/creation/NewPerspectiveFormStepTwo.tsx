/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Spacer, FormGroup, FormLabel, TextInput, TextArea } from '@instana/components';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ProcessesLiveList from 'in-bizops/lists/businessPerspectives/creation/ProcessesLiveList';
import { t } from 'in-i18n';

import locals from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

interface NewPerspectiveFormStepTwoProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  processesLiveList: any;
}

export function NewPerspectiveFormStepTwo({ form, updateForm, processesLiveList }: NewPerspectiveFormStepTwoProps) {
  const perspectiveNameField = form.get('perspectiveName');
  const perspectiveDescription = form.get('perspectiveDescription');

  //TODO! Remove FormLabel and replace it with the labelText prop for the TextArea component once I update to the new @instana/components
  //labelText={t("in-bizops:perspectives.dialog.stepTwo.perspectiveDescription")}
  return (
    <SimpleModeStepContentWrapper headline={t('in-bizops:perspectives.dialog.stepTwo.headline')}>
      <div className={locals.contentParent}>
        <FormGroup className={locals.leftContent}>
          <FormLabel>{t('in-bizops:perspectives.dialog.stepTwo.perspectiveName')}</FormLabel>
          <TextInput
            id="perspectiveName"
            value={perspectiveNameField.value}
            onChange={(e: any) =>
              updateForm(
                form.updateIn(['perspectiveName'], field => field.setValue(e.target.value || '').setTouched(true))
              )
            }
            autoComplete="off"
            hasError={!perspectiveNameField.value && perspectiveNameField.touched}
          />
          <Spacer vertical="normal" />

          <FormLabel>{t('in-bizops:perspectives.dialog.stepTwo.perspectiveDescription')}</FormLabel>
          <TextArea
            id="perspectiveDescription"
            className={locals.leftContent}
            carbonVariant
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
          />
        </FormGroup>
        <div className={locals.rightContent}>
          <ProcessesLiveList processesLiveList={processesLiveList} />
        </div>
      </div>
    </SimpleModeStepContentWrapper>
  );
}
