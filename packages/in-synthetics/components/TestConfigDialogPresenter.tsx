/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, ReactNode } from 'react';
import { MapForm, Field } from 'formalistic';

import { createLogger } from '@instana/logger';
import { Button } from '@instana/components';

import { showCreateSuccessMessage, showCreateErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import TestCreationWithSteps from 'in-synthetics/components/TestCreationWithSteps';
import { syntheticCreateTestAdvanceModeEnabled } from 'in-services/featureFlags';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { blueprintConfig } from 'in-synthetics/data/simpleModeBluePrints';
import { createForm } from 'in-synthetics/form/createSyntheticTestForm';
import { SyntheticTest, Error as ScriptError } from 'in-types';
import { createTest } from 'in-synthetics/api';
import { t } from 'in-i18n';

const logger = createLogger('in-synthetics/components/TestConfigDialogPresenter');

export interface SlideInConfig {
  title?: string;
  component?: ReactNode;
}

export interface SliderState {
  slideInConfig?: SlideInConfig;
  isVisible: boolean;
}
interface Props {
  onClose: () => void;
  reloadTests: () => void;
}

export default function TestConfigDialogPresenter({ onClose, reloadTests }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simpleModeStep, setSimpleModeStep] = useState(0);
  const [simpleMode, setSimpleMode] = useState(true);
  const [form, setForm] = useState(() => createForm());
  const [scriptErrors, setScriptErrors] = useState([] as ScriptError[]);
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);
  const [slideInConfig, setSlideInConfig] = useState<SlideInConfig | null>(null);
  const [slideInViewVisible, setSlideInViewVisible] = useState<boolean>(false);
  const [testTypeSelected, setTestTypeSelected] = useState({ simple: true, script: false });

  const formId = 'create-synthetics-test-form';

  const setSliderState = ({ slideInConfig, isVisible }: SliderState) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

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

  function onSubmit(form: MapForm<any>) {
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
    const configForm = form.get('configuration') as MapForm<any>;
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
          (selectedBlueprint.type === 'Script API' && scriptErrors.length !== 0)
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
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      removeBottomPaddingWhenFooterIsShown
      renderCustomCloseBehaviour={resetScrollShadow => (
        <>
          {simpleMode && syntheticCreateTestAdvanceModeEnabled && (
            <Button
              kind="action"
              onClick={() => {
                // TODO: Reset form state
                // TODO: Track mode switching state
                setSimpleMode(!simpleMode);
                setForm(createForm(!simpleMode));
                resetScrollShadow();
              }}
            >
              {t('in-synthetics:dialog.createTest.advancedMode.switchModeButton')}
            </Button>
          )}
        </>
      )}
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
        selectedBlueprint={selectedBlueprint}
        setSelectedBlueprint={setSelectedBlueprint}
        scriptErrors={scriptErrors}
        setScriptErrors={setScriptErrors}
        simpleMode={simpleMode}
        setSliderState={setSliderState}
        testTypeSelected={testTypeSelected}
        setTestTypeSelected={setTestTypeSelected}
      />
      <DialogFooter
        formId={formId}
        form={form}
        primaryActionText={
          simpleModeStep === stepConfigs.length - 1 || !simpleMode
            ? t('in-components:blueprintFormMultistep.buttonCreate')
            : t('in-components:blueprintFormMultistep.buttonNext')
        }
        onSecondaryActionClick={() => onGoBack()}
        secondaryActionText={
          simpleModeStep === 0 || !simpleMode
            ? t('in-components:blueprintFormMultistep.buttonCancel')
            : t('in-components:blueprintFormMultistep.buttonBack')
        }
        primaryActionDisabled={simpleMode ? isProceedDisabled() : false}
        saving={isSubmitting}
      />
    </DialogWithSlideInView>
  );
}
