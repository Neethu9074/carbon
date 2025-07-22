/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';
import classNames from 'classnames';

import { Error as ScriptError } from '@instana/types';
import { t } from '@instana/i18n-react';

import {
  Code,
  SlideInConfig,
  SlideInHeader,
  SliderState,
  TeamTagEx,
  TestTypeSelected,
  AssertionTargetFilter
} from 'in-synthetics/utils/constants';
import getDefaultCustomProperties from 'in-synthetics/createTests/utils/getDefaultCustomProperties';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { getTargetFilters } from 'in-synthetics/createTests/utils/getDefaultTargetFilters';
import { syntheticAdvancedCreateButtonClick } from 'in-synthetics/tracking/tracker';
import getDefaultHeaders from 'in-synthetics/createTests/utils/getDefaultHeaders';
import { DNSErrorsExist } from 'in-synthetics/createTests/utils/DNSErrorExist';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import getDefaultTeams from 'in-synthetics/createTests/utils/getDefaultTeams';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import AdvancedMode from 'in-synthetics/createTests/advanced/AdvancedMode';

import locals from 'in-synthetics/createTests/dialog/CreateSyntheticTestDialogPresenter.mless';

export interface CreateSyntheticTestDialogPresenterProps {
  onClose: () => void;
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
  form,
  formId,
  onCreate,
  updateForm,
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

  //commonAttributes stores common SyntheticTest configuration attributes
  //between Simple Mode and Advanced Mode. These attributes are: syntheticType, url (HTTPAction),
  //script (HTTPScript), locations, testFrequency, label, description, and applicationId.
  const [commonAttributes, setCommonAttributes] = useState<Record<string, any>>({});
  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState<SlideInHeader>({
    title: null,
    onClose: null
  });

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

  const footer = (
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
        //populateCommonAttributes({ form, commonAttributes, setCommonAttributes });
        //updateForm(createForm(selectedBlueprint, commonAttributes));
      }}
      removeBottomPaddingWhenFooterIsShown
      doNotCloseOnOutsideClick
    >
      <div
        className={classNames({
          [locals.simpleDialog]: true,
          [locals.wizardDialog]: false,
          [locals.advancedDialog]: true
        })}
      >
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
      </div>
    </DialogWithSlideInView>
  );
};

export default CreateSyntheticTestDialogPresenter;
