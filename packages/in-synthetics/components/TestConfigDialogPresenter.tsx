/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm, Field } from 'formalistic';
import React, { useState } from 'react';

import { createLogger } from '@instana/logger';

import { showCreateSuccessMessage, showCreateErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import TestCreationWithSteps from 'in-synthetics/components/TestCreationWithSteps';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { blueprintConfig } from 'in-synthetics/data/simpleModeBluePrints';
import { createForm } from 'in-synthetics/form/createSyntheticTestForm';
import { createTest } from 'in-synthetics/api';
import { SyntheticTest } from 'in-types';
import { t } from 'in-i18n';

const logger = createLogger('in-synthetics/components/TestConfigDialogPresenter');

interface Props {
  onClose: () => void;
  reloadTests: () => void;
}

export default function TestConfigDialogPresenter({ onClose, reloadTests }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simpleModeStep, setSimpleModeStep] = useState(0);
  const [form, setForm] = useState(() => createForm());
  const formId = 'create-synthetics-test-form';
  const [enableNextButton, setEnableNextButton] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);
  const [scriptErrorExists, setScriptErrorExists] = useState(false);

  const stepConfigs = Object.freeze([
    {
      title: t('in-synthetics:dialog.createTest.titles.step1')
    },
    {
      title: t('in-synthetics:dialog.createTest.titles.step2')
    },
    {
      title: t('in-synthetics:dialog.createTest.titles.step3')
    },
    {
      title: t('in-synthetics:dialog.createTest.titles.step4')
    }
  ]);

  function onSubmit(form: MapForm) {
    setIsSubmitting(true);
    const testConfig = {
      active: true,
      ...form.toJS()
    } as SyntheticTest;

    /**
     * Make the api call with the formated payload
     * Success: Close and show success message
     * Error: Show error to user and log the error
     */
    createTest(testConfig).once(
      () => {
        onClose();
        reloadTests();
        showCreateSuccessMessage();
      },
      error => {
        setIsSubmitting(false);
        showCreateErrorMessage();
        logger.error(`failed to save synthetic test: ${testConfig} ${error.message}`, error);
      }
    );
  }

  /**
   * A single form is being rendered in multiple pages in the simple mode
   * It makes the form validation hard as on clicking the proceed button it has to validate only the rendered
   * form inputs. This can be achieved by disabling the proceed button on specific steps based on conditions
   */
  const isProceedDisabled = () => {
    const configForm = form.get('configuration') as MapForm;
    const syntheticTypeField = configForm.get('syntheticType') as Field<string>;
    const labelField = form.get('label') as Field<string>;
    const frequencyField = form.get('testFrequency') as Field<number>;
    const locationsField = form.get('locations') as Field<string[]>;

    switch (simpleModeStep) {
      case 0:
        return !syntheticTypeField.valid;
      case 1:
        return (
          !configForm.hierarchyValid ||
          locationsField.value.length === 0 ||
          (selectedBlueprint.type === 'Script API' && !enableNextButton)
        );
      case 2:
        return !frequencyField.valid;
      case 3:
        return !labelField.valid || isSubmitting;
      default:
        return false;
    }
  };

  const onGoBack = () => {
    if (
      selectedBlueprint.type === 'Script API' &&
      (simpleModeStep === 1 || simpleModeStep === 2) &&
      scriptErrorExists
    ) {
      setEnableNextButton(false);
    }
    if (simpleModeStep !== 0) {
      setSimpleModeStep(simpleModeStep - 1);
      return;
    }
    onClose();
  };

  return (
    <DialogWithSlideInView
      title={t('in-synthetics:dialog.createTest.dialogTitle')}
      slideInViewTitle={''}
      onSlideInViewTitleClick={() => {}}
      titleIconType="lib_line_chart"
      onClose={onClose}
      doNotCloseOnOutsideClick
      slideInViewVisible={false} // Change it when needed
      slideInViewComponent={null}
      removeBottomPaddingWhenFooterIsShown
    >
      <TestCreationWithSteps
        onDialogClose={onClose}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        form={form}
        step={simpleModeStep}
        updateForm={setForm}
        updateStep={setSimpleModeStep}
        formId={formId}
        stepConfigs={stepConfigs}
        setEnableNextButton={setEnableNextButton}
        selectedBlueprint={selectedBlueprint}
        setSelectedBlueprint={setSelectedBlueprint}
        setScriptErrorExists={setScriptErrorExists}
      />
      <DialogFooter
        formId={formId}
        form={form}
        primaryActionText={
          simpleModeStep === stepConfigs.length - 1
            ? t('in-components:blueprintFormMultistep.buttonCreate')
            : t('in-components:blueprintFormMultistep.buttonNext')
        }
        onSecondaryActionClick={() => onGoBack()}
        secondaryActionText={
          simpleModeStep === 0
            ? t('in-components:blueprintFormMultistep.buttonCancel')
            : t('in-components:blueprintFormMultistep.buttonBack')
        }
        primaryActionDisabled={isProceedDisabled()}
        saving={isSubmitting}
      />
    </DialogWithSlideInView>
  );
}
