/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, ReactNode, SetStateAction } from 'react';
import { MapForm, Field } from 'formalistic';
import { isEmpty } from 'lodash';

import { createLogger } from '@instana/logger';
import { Button } from '@instana/components';

import { showCreateSuccessMessage, showCreateErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { SlideInHeader, apiScriptTest, apiSimpleTest } from 'in-synthetics/utils/constants';
import TestCreationWithSteps from 'in-synthetics/components/TestCreationWithSteps';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { blueprintConfig } from 'in-synthetics/data/simpleModeBluePrints';
import { createForm } from 'in-synthetics/form/createSyntheticTestForm';
import { SyntheticTest, Error as ScriptError } from 'in-types';
import { isNotBlank } from 'in-services/util/string';
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
  const [testTypeSelected, setTestTypeSelected] = useState({ simple: false, script: false });
  const [renderSectionsCounter, setRenderSectionsCounter] = useState(0);
  //commonAttributes stores common SyntheticTest configuration attributes
  //between Simple Mode and Advanced Mode. These attributes are: syntheticType, url (HTTPAction),
  //script (HTTPScript), locations, testFrequency, label, description, and applicationId.
  const [commonAttributes, setCommonAttributes] = useState<Record<string, any>>({});
  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState<SlideInHeader>({
    title: null,
    onClose: null
  });

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
    let testConfig: SyntheticTest;
    let updatedForm: MapForm<any>;
    if (simpleMode) {
      testConfig = {
        active: true,
        ...form.toJS()
      } as SyntheticTest;
    } else {
      if (
        form.get('configuration').get('syntheticType').value !== 'HTTPScript' &&
        isEmpty(form.get('configuration').get('headers').value)
      ) {
        updatedForm = form.put('configuration', form.get('configuration').remove('headers'));
        testConfig = {
          active: true,
          ...updatedForm.toJS()
        } as SyntheticTest;
      } else {
        testConfig = {
          active: true,
          ...form.toJS()
        } as SyntheticTest;
      }
    }

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
          (form.get('configuration').get('syntheticType').value === 'HTTPScript' && scriptErrors.length !== 0)
        );
      case 2:
        return !frequencyField.valid;
      case 3:
        return !labelField.valid || isSubmitting;
      default:
        return false;
    }
  };

  const isProceedDisabledAdvanced = () => {
    const configForm = form.get('configuration') as MapForm<any>;
    const syntheticTypeField = configForm.get('syntheticType') as Field<string>;
    const labelField = form.get('label') as Field<string>;
    const frequencyField = form.get('testFrequency') as Field<number>;
    const locationsField = form.get('locations') as Field<string[]>;
    if (
      isSubmitting ||
      // for HTTPAction
      (syntheticTypeField.value === 'HTTPAction' && configForm.get('url') && !configForm.get('url').valid) ||
      // for HTTPScript
      (syntheticTypeField.value === 'HTTPScript' &&
        // Initially there isn't 'script'/ 'scripts' within configuration
        ((!configForm.get('script') && !configForm.get('scripts')) ||
          // validating js file if 'script' is present
          (configForm.get('script') && !configForm.get('script').valid) ||
          // validating zip file if 'scripts' is present
          (configForm.get('scripts') &&
            (!configForm.getIn(['scripts', 'bundle']).valid || !configForm.getIn(['scripts', 'scriptFile']).valid)))) ||
      !syntheticTypeField.valid ||
      locationsField.value.length === 0 ||
      !frequencyField.valid ||
      !labelField.valid
    ) {
      return true;
    }
    return false;
  };

  const onGoBack = () => {
    if (simpleModeStep !== 0) {
      setSimpleModeStep(simpleModeStep - 1);
      return;
    }
    onClose();
  };

  const footer = simpleMode ? (
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
  ) : (
    <FormFooter>
      <CancelButton onClick={() => onClose()} />
      <SaveButton
        type="submit"
        kind="primary"
        formId={formId}
        form={form}
        isSaving={isSubmitting}
        disabled={isProceedDisabledAdvanced()}
      >
        {t('in-components:blueprintFormMultistep.buttonCreate')}
      </SaveButton>
    </FormFooter>
  );

  const populateCommonAttributes = (form: MapForm<any>) => {
    commonAttributes['syntheticType'] = form.get('configuration').get('syntheticType').value;
    commonAttributes['url'] = form.get('configuration').get('url')?.value;
    commonAttributes['testFrequency'] = form.get('testFrequency').value;
    commonAttributes['locations'] = form.get('locations').value;
    commonAttributes['label'] = form.get('label').value;
    commonAttributes['description'] = form.get('description').value;
    commonAttributes['applicationId'] = form.get('applicationId').value;
    commonAttributes['script'] = form.get('configuration').get('script')?.value;
    setCommonAttributes(commonAttributes);
  };

  return (
    <DialogWithSlideInView
      footer={footer}
      title={t('in-synthetics:dialog.createTest.dialogTitle')}
      slideInViewTitle={customSlideInHeaderConfig?.title ?? slideInConfig?.title}
      onSlideInViewTitleClick={() =>
        customSlideInHeaderConfig.onClose
          ? customSlideInHeaderConfig.onClose()
          : setSlideInViewVisible(!slideInViewVisible)
      }
      titleIconType="lib_line_chart"
      onClose={onClose}
      doNotCloseOnOutsideClick
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      removeBottomPaddingWhenFooterIsShown
      renderCustomCloseBehaviour={resetScrollShadow => (
        <>
          {simpleMode && (
            <Button
              kind="action"
              onClick={() => {
                // TODO: Reset form state
                // TODO: Track mode switching state
                // Pass attributes set in the basic mode to advanced mode
                setTestTypeSelected((prevState: SetStateAction<any>) => {
                  if (selectedBlueprint.type === apiSimpleTest) return { ...prevState, simple: true, script: false };
                  if (selectedBlueprint.type === apiScriptTest) return { ...prevState, simple: false, script: true };
                });
                populateCommonAttributes(form);
                setSimpleMode(!simpleMode);
                setForm(createForm(!simpleMode, selectedBlueprint, commonAttributes));
                resetScrollShadow();
                if (
                  isNotBlank(commonAttributes.url) ||
                  commonAttributes.locations.length !== 0 ||
                  isNotBlank(commonAttributes.label) ||
                  isNotBlank(commonAttributes.description) ||
                  isNotBlank(commonAttributes.applicationId) ||
                  isNotBlank(commonAttributes.script)
                ) {
                  setRenderSectionsCounter(v => v + 1);
                }
              }}
              disabled={
                form.get('configuration').get('syntheticType').value === 'HTTPScript' && scriptErrors.length !== 0
              }
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
        renderSectionsCounter={renderSectionsCounter}
        setRenderSectionsCounter={setRenderSectionsCounter}
        commonAttributes={commonAttributes}
        setCommonAttributes={setCommonAttributes}
        setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
      />
    </DialogWithSlideInView>
  );
}
