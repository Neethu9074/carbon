/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { SetStateAction, useState } from 'react';
import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  Code,
  SSLCertificateTest,
  SlideInConfig,
  SlideInHeader,
  SliderState,
  TeamTagEx,
  TestTypeSelected,
  apiScriptTest,
  apiSimpleTest,
  browserScriptTest,
  browserSimpleTest,
  AssertionTargetFilter
} from 'in-synthetics/utils/constants';
import { syntheticAdvancedCreateButtonClick, syntheticCreateAdvancedButtonClick } from 'in-synthetics/tracking/tracker';
import getDefaultCustomProperties from 'in-synthetics/createTests/utils/getDefaultCustomProperties';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import populateCommonAttributes from 'in-synthetics/createTests/utils/populateCommonAttributes';
import { getSimpleBlueprintConfig } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { getTargetFilters } from 'in-synthetics/createTests/utils/getDefaultTargetFilters';
import WizardModeContainer from 'in-synthetics/createTests/wizard/WizardModeContainer';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import getDefaultHeaders from 'in-synthetics/createTests/utils/getDefaultHeaders';
import { DNSErrorsExist } from 'in-synthetics/createTests/utils/DNSErrorExist';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import getDefaultTeams from 'in-synthetics/createTests/utils/getDefaultTeams';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import AdvancedMode from 'in-synthetics/createTests/advanced/AdvancedMode';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
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
  const { trackCta } = useSegmentTracking();
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  //commonAttributes stores common SyntheticTest configuration attributes
  //between Simple Mode and Advanced Mode. These attributes are: syntheticType, url (HTTPAction),
  //script (HTTPScript), locations, testFrequency, label, description, and applicationId.
  const [commonAttributes, setCommonAttributes] = useState<Record<string, any>>({});
  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState<SlideInHeader>({
    title: null,
    onClose: null
  });
  const [selectedBlueprint, setSelectedBlueprint] = useState(getSimpleBlueprintConfig()[0]);
  const [headers, setHeaders] = useState(getDefaultHeaders(form));
  const [invalidHeader, setInvalidHeader] = useState({ invalid: false, message: '' });
  const [invalidJSON, setInvalidJSON] = useState({ invalid: false, message: '' });
  const [invalidTimeout, setInvalidTimeout] = useState({ invalid: false, message: '' });
  const [teams, setTeams] = useState<TeamTagEx[]>(getDefaultTeams(form));
  const [customProperties, setCustomProperties] = useState(getDefaultCustomProperties(form));
  const [invalidCustomProperty, setInvalidCustomProperty] = useState({ invalid: false, message: '' });
  const [targetFilters, setTargetFilters] = useState(getTargetFilters(form, 'targetValues'));
  const [validationFilters, setValidationFilters] = useState(getTargetFilters(form, 'validationRules'));
  const [showAssertionsWarning, setShowAssertionsWarning] = useState(false);
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
    const labelField = form.get('label') as Field<string>;

    switch (step) {
      case 1: {
        let stepDisabled;
        if (syntheticTypeField.value === 'HTTPAction' || syntheticTypeField.value === 'WebpageAction') {
          stepDisabled = configForm.hierarchyValid && locationsField.value.length !== 0;
        }
        if (
          syntheticTypeField.value === 'HTTPScript' ||
          syntheticTypeField.value === 'BrowserScript' ||
          syntheticTypeField.value === 'WebpageScript'
        ) {
          stepDisabled = configForm.hierarchyValid && scriptErrors.length === 0 && locationsField.value.length !== 0;
        }
        return stepDisabled;
      }
      case 2:
        return frequencyField.valid;
      case 3:
        return syntheticRbacLimitedEnabled ? labelField.valid : true;
      default:
        return true;
    }
  };

  const HTTPActionErrorsExist = (configForm: MapForm<any>, syntheticTypeField: Field<string>) => {
    return syntheticTypeField.value === 'HTTPAction'
      ? (configForm.get('headers') &&
          headers.filter(
            header =>
              (header.error.name.invalid && !header.error.value.invalid) ||
              (!header.error.name.invalid && header.error.value.invalid)
          ).length > 0) ||
          invalidHeader.invalid ||
          (configForm.get('expectStatus') && !configForm.get('expectStatus').valid) ||
          invalidJSON.invalid ||
          (configForm.get('expectMatch') && !configForm.get('expectMatch').valid)
      : undefined;
  };

  const SSLCertificateErrorsExist = (
    configForm: MapForm<any>,
    syntheticTypeField: Field<string>,
    validationFilters: AssertionTargetFilter[]
  ) => {
    return syntheticTypeField.value === 'SSLCertificate'
      ? (configForm.get('hostname') && !configForm.get('hostname').valid) ||
          (configForm.get('port') && !configForm.get('port').valid) ||
          (configForm.get('daysRemainingCheck') && !configForm.get('daysRemainingCheck').valid) ||
          (configForm.get('validationRules') &&
            validationFilters.some(
              targetFilter =>
                targetFilter.error.key.invalid ||
                targetFilter.error.operator.invalid ||
                targetFilter.error.value.invalid
            ))
      : undefined;
  };

  const scriptErrorExist = (configForm: MapForm<any>, syntheticTypeField: Field<string>) => {
    return syntheticTypeField.value === 'HTTPScript' ||
      syntheticTypeField.value === 'WebpageScript' ||
      syntheticTypeField.value === 'BrowserScript'
      ? // Initially there isn't 'script'/ 'scripts' within configuration
        (!configForm.get('script') && !configForm.get('scripts')) ||
          // validating js file if 'script' is present
          (configForm.get('script') && !configForm.get('script').valid) ||
          // validating zip file if 'scripts' is present
          (configForm.get('scripts') &&
            (!configForm.getIn(['scripts', 'bundle']).valid || !configForm.getIn(['scripts', 'scriptFile']).valid))
      : undefined;
  };

  const configPropertyErrorExist = () => {
    return (
      customProperties.filter(
        property =>
          (property.error.name.invalid && !property.error.value.invalid) ||
          (!property.error.name.invalid && property.error.value.invalid)
      ).length > 0 || invalidCustomProperty.invalid
    );
  };

  const isProceedDisabledAdvanced = () => {
    const configForm = form.get('configuration') as MapForm<any>;
    const syntheticTypeField = configForm.get('syntheticType') as Field<string>;
    const labelField = form.get('label') as Field<string>;
    const frequencyField = form.get('testFrequency') as Field<number>;
    const locationsField = form.get('locations') as Field<string[]>;

    if (
      isSaving ||
      renderSectionsCounter === 0 ||
      // for HTTPAction & WebpageAction
      ((syntheticTypeField.value === 'HTTPAction' || syntheticTypeField.value === 'WebpageAction') &&
        configForm.get('url') &&
        !configForm.get('url').valid) ||
      // for HTTPAction
      HTTPActionErrorsExist(configForm, syntheticTypeField) ||
      // for HTTPScript, WebpageScript, and BrowserScript
      scriptErrorExist(configForm, syntheticTypeField) ||
      // for SSL Certificate
      SSLCertificateErrorsExist(configForm, syntheticTypeField, validationFilters) ||
      // for DNS
      DNSErrorsExist(configForm, syntheticTypeField, targetFilters, showAssertionsWarning) ||
      !syntheticTypeField.valid ||
      locationsField.value.length === 0 ||
      !frequencyField.valid ||
      !labelField.valid ||
      configPropertyErrorExist() ||
      invalidTimeout.invalid
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
        onClick={() => {
          // Segment Tracker
          syntheticAdvancedCreateButtonClick(trackCta);
          onCreate();
        }}
      >
        {t('in-components:blueprintFormMultistep.buttonCreate')}
      </SaveButton>
    </FormFooter>
  );

  const getSelectedTestSubTypes = (prevState: SetStateAction<any>) => {
    if (selectedBlueprint.type === apiSimpleTest) return { ...prevState, api: { simple: true, script: false } };
    if (selectedBlueprint.type === apiScriptTest) return { ...prevState, api: { simple: false, script: true } };
    if (selectedBlueprint.type === browserSimpleTest) return { ...prevState, browser: { simple: true, script: false } };
    if (selectedBlueprint.type === browserScriptTest) return { ...prevState, browser: { simple: false, script: true } };
    if (selectedBlueprint.type === SSLCertificateTest) return { ...prevState, ssl: { simple: true } };
  };

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
                // Segment Track
                syntheticCreateAdvancedButtonClick(trackCta);
                //@ts-expect-error
                setTestTypeSelected((prevState: SetStateAction<any>) => {
                  return getSelectedTestSubTypes(prevState);
                });
                setSimpleMode(!simpleMode);
                populateCommonAttributes({ form, commonAttributes, setCommonAttributes });
                updateForm(createForm(!simpleMode, selectedBlueprint, commonAttributes));
                resetScrollShadow();
                if (
                  isNotBlank(commonAttributes.url) ||
                  commonAttributes.locations.length !== 0 ||
                  isNotBlank(commonAttributes.label) ||
                  isNotBlank(commonAttributes.description) ||
                  isNotBlank(commonAttributes.applicationId) ||
                  commonAttributes.applications.length !== 0 ||
                  isNotBlank(commonAttributes.script)
                ) {
                  setRenderSectionsCounter((v: number) => v + 1);
                }
              }}
              disabled={
                ['HTTPScript', 'BrowserScript'].includes(form.get('configuration').get('syntheticType').value) &&
                scriptErrors.length !== 0
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
      <div
        className={classNames({
          [locals.simpleDialog]: true,
          [locals.wizardDialog]: simpleMode,
          [locals.advancedDialog]: !simpleMode
        })}
      >
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
            setSliderState={setSliderState}
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
            headers={headers}
            setHeaders={setHeaders}
            invalidHeader={invalidHeader}
            setInvalidHeader={setInvalidHeader}
            invalidJSON={invalidJSON}
            setInvalidJSON={setInvalidJSON}
            teams={teams}
            setTeams={setTeams}
            customProperties={customProperties}
            setCustomProperties={setCustomProperties}
            invalidCustomProperty={invalidCustomProperty}
            setInvalidCustomProperty={setInvalidCustomProperty}
            invalidTimeout={invalidTimeout}
            setInvalidTimeout={setInvalidTimeout}
            targetFilters={targetFilters}
            setTargetFilters={setTargetFilters}
            showAssertionsWarning={showAssertionsWarning}
            setShowAssertionsWarning={setShowAssertionsWarning}
            validationFilters={validationFilters}
            setValidationFilters={setValidationFilters}
          />
        )}
      </div>
    </DialogWithSlideInView>
  );
};

export default CreateSyntheticTestDialogPresenter;
