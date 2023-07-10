/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState } from 'react';
import { Field, MapForm } from 'formalistic';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  Code,
  SlideInConfig,
  SlideInHeader,
  SliderState,
  TestTypeSelected,
  apiScriptTest,
  apiSimpleTest
} from 'in-synthetics/utils/constants';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import WizardModeContainer from 'in-synthetics/createTests/wizard/WizardModeContainer';
import { blueprintConfig } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import AdvancedMode from 'in-synthetics/createTests/advanced/AdvancedMode';
import { isNotBlank } from 'in-services/util/string';
import { Error as ScriptError } from 'in-types';

import locals from 'in-synthetics/createTests/dialog/CreateSyntheticTestDialogPresenter.mless';

export interface CreateSyntheticTestDialogPresenterProps {
  onClose: () => void;
  simpleMode: boolean;
  setSimpleMode: React.Dispatch<React.SetStateAction<boolean>>;
  form: MapForm<any>;
  formId: string;
  updateForm: (form: MapForm<any>) => void;
  onCreate: () => void;
  scriptErrors: ScriptError[];
  setScriptErrors: React.Dispatch<React.SetStateAction<ScriptError[]>>;
  scriptDetails: Code;
  setScriptDetails: React.Dispatch<React.SetStateAction<Code>>;
  isSaving: boolean;
  slideInViewVisible: boolean;
  setSlideInViewVisible: React.Dispatch<React.SetStateAction<boolean>>;
  slideInConfig: SlideInConfig | null;
  setSliderState: (state: SliderState) => void;
  testTypeSelected: TestTypeSelected;
  setTestTypeSelected: (t: TestTypeSelected) => void;
  renderSectionsCounter: number;
  setRenderSectionsCounter: React.Dispatch<React.SetStateAction<number>>;
}

const CreateSyntheticTestDialogPresenter = ({
  onClose,
  simpleMode,
  setSimpleMode,
  form,
  formId,
  onCreate,
  updateForm,
  scriptErrors,
  setScriptErrors,
  scriptDetails,
  setScriptDetails,
  isSaving,
  slideInViewVisible,
  setSlideInViewVisible,
  slideInConfig,
  setSliderState,
  testTypeSelected,
  setTestTypeSelected,
  renderSectionsCounter,
  setRenderSectionsCounter
}: CreateSyntheticTestDialogPresenterProps) => {
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  //commonAttributes stores common SyntheticTest configuration attributes
  //between Simple Mode and Advanced Mode. These attributes are: syntheticType, url (HTTPAction),
  //script (HTTPScript), locations, testFrequency, label, description, and applicationId.
  const [commonAttributes, setCommonAttributes] = useState<Record<string, any>>({});
  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState<SlideInHeader>({
    title: null,
    onClose: null
  });
  const [selectedBlueprint, setSelectedBlueprint] = useState(blueprintConfig[0]);

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

  /**
   * A single form is being rendered in multiple pages in the simple mode
   * It makes the form validation hard as on clicking the proceed button it has to validate only the rendered
   * form inputs. This can be achieved by disabling the proceed button on specific steps based on conditions
   */
  const isStepDisabled = (step: number) => {
    const configForm = form.get('configuration') as MapForm<any>;
    const syntheticTypeField = configForm.get('syntheticType') as Field<string>;
    const frequencyField = form.get('testFrequency') as Field<number>;
    const locationsField = form.get('locations') as Field<string[]>;

    switch (step) {
      case 1: {
        let stepDisabled;
        if (syntheticTypeField.value === 'HTTPAction') {
          stepDisabled = configForm.hierarchyValid && locationsField.value.length !== 0;
        }
        if (syntheticTypeField.value === 'HTTPScript') {
          stepDisabled = configForm.hierarchyValid && scriptErrors.length === 0;
        }
        return stepDisabled;
      }
      case 2:
        return frequencyField.valid;
      default:
        return true;
    }
  };

  const isProceedDisabledAdvanced = () => {
    const configForm = form.get('configuration') as MapForm<any>;
    const syntheticTypeField = configForm.get('syntheticType') as Field<string>;
    const labelField = form.get('label') as Field<string>;
    const frequencyField = form.get('testFrequency') as Field<number>;
    const locationsField = form.get('locations') as Field<string[]>;
    if (
      isSaving ||
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

  const footer = simpleMode ? null : (
    <FormFooter>
      <CancelButton onClick={() => onClose()} />
      <SaveButton
        type="submit"
        kind="primary"
        formId={formId}
        form={form}
        isSaving={isSaving}
        disabled={isProceedDisabledAdvanced()}
        onClick={() => onCreate()}
      >
        {t('in-components:blueprintFormMultistep.buttonCreate')}
      </SaveButton>
    </FormFooter>
  );

  return (
    <DialogWithSlideInView
      footer={footer}
      title={t('in-synthetics:dialog.createTest.dialogTitle')}
      titleIconType="lib_line_chart"
      onClose={onClose}
      slideInViewTitle={customSlideInHeaderConfig?.title ?? slideInConfig?.title}
      slideInViewVisible={slideInViewVisible}
      onSlideInViewTitleClick={() =>
        customSlideInHeaderConfig.onClose
          ? customSlideInHeaderConfig.onClose()
          : setSlideInViewVisible(!slideInViewVisible)
      }
      slideInViewComponent={slideInConfig?.component}
      //@ts-expect-error
      renderCustomCloseBehaviour={resetScrollShadow => {
        return (
          simpleMode && (
            <Button
              kind="action"
              onClick={() => {
                //@ts-expect-error
                setTestTypeSelected((prevState: SetStateAction<any>) => {
                  if (selectedBlueprint.type === apiSimpleTest)
                    return { ...prevState, api: { simple: true, script: false } };
                  if (selectedBlueprint.type === apiScriptTest)
                    return { ...prevState, api: { simple: false, script: true } };
                });
                setSimpleMode(!simpleMode);
                populateCommonAttributes(form);
                updateForm(createForm(!simpleMode, selectedBlueprint, commonAttributes));
                resetScrollShadow();
                if (
                  isNotBlank(commonAttributes.url) ||
                  commonAttributes.locations.length !== 0 ||
                  isNotBlank(commonAttributes.label) ||
                  isNotBlank(commonAttributes.description) ||
                  isNotBlank(commonAttributes.applicationId) ||
                  isNotBlank(commonAttributes.script)
                ) {
                  setRenderSectionsCounter((v: number) => v + 1);
                }
              }}
              disabled={
                form.get('configuration').get('syntheticType').value === 'HTTPScript' && scriptErrors.length !== 0
              }
            >
              {t('in-synthetics:dialog.createTest.advancedMode.switchModeButton')}
            </Button>
          )
        );
      }}
      removeBottomPaddingWhenFooterIsShown
      doNotCloseOnOutsideClick
    >
      <div className={simpleMode ? locals.simpleDialog : locals.advancedDialog}>
        {simpleMode ? (
          <WizardModeContainer
            form={form}
            formId={formId}
            onClose={onClose}
            onCreate={onCreate}
            updateForm={updateForm}
            simpleMode={simpleMode}
            setSimpleModeStep={setSimpleModeStep}
            simpleModeStep={simpleModeStep}
            scriptErrors={scriptErrors}
            setScriptErrors={setScriptErrors}
            scriptDetails={scriptDetails}
            setScriptDetails={setScriptDetails}
            isSaving={isSaving}
            isStepDisabled={isStepDisabled}
            selectedBlueprint={selectedBlueprint}
            setSelectedBlueprint={setSelectedBlueprint}
          />
        ) : (
          <AdvancedMode
            form={form}
            updateForm={updateForm}
            setSliderState={setSliderState}
            testTypeSelected={testTypeSelected}
            setTestTypeSelected={setTestTypeSelected}
            renderSectionsCounter={renderSectionsCounter}
            setRenderSectionsCounter={setRenderSectionsCounter}
            commonAttributes={commonAttributes}
            setCommonAttributes={setCommonAttributes}
            setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
            isUpdateConfig={false}
            scriptDetails={scriptDetails}
            setScriptDetails={setScriptDetails}
          />
        )}
      </div>
    </DialogWithSlideInView>
  );
};

export default CreateSyntheticTestDialogPresenter;
