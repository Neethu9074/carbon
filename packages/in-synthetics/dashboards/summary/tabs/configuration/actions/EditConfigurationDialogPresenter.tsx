/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, ReactNode } from 'react';
import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';

import { generateUniqueShortId } from '@instana/utils';
import { createLogger } from '@instana/logger';

import cleanConfigurationForm from 'in-synthetics/dashboards/summary/tabs/configuration/actions/cleanConfigurationForm';
import { ConfigItem, SlideInHeader, TestTypeSelected, AssertionTargetFilter } from 'in-synthetics/utils/constants';
import { showUpdateSuccessMessage, showUpdateErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import { clickSyntheticMonitoringConfigurationTabEditTracker } from 'in-synthetics/tracking/tracker';
import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { getTargetFilters } from 'in-synthetics/createTests/utils/getDefaultTargetFilters';
import { updateForm } from 'in-synthetics/createTests/form/updateSyntheticTestForm';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { DNSErrorsExist } from 'in-synthetics/createTests/utils/DNSErrorExist';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import AdvancedMode from 'in-synthetics/createTests/advanced/AdvancedMode';
import { updateTest } from 'in-synthetics/api';
import { SyntheticTest } from 'in-types';
import { t } from 'in-i18n';

import locals from './EditConfigurationDialogPresenter.mless';

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
  test: SyntheticTest;
  onClose: () => void;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function EditConfigurationDialogPresenter({ test, onClose, setReloadCount }: Props) {
  const { trackCta } = useSegmentTracking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(() => updateForm(test));
  const [slideInConfig, setSlideInConfig] = useState<SlideInConfig | null>(null);
  const [slideInViewVisible, setSlideInViewVisible] = useState<boolean>(false);
  const [renderSectionsCounter, setRenderSectionsCounter] = useState(1);
  const [commonAttributes, setCommonAttributes] = useState<Record<string, any>>({
    syntheticType: test.configuration.syntheticType,
    url: form.get('configuration').get('url')?.value,
    testFrequency: form.get('testFrequency').value,
    locations: form.get('locations').value,
    label: form.get('label').value,
    description: form.get('description').value,
    applicationId: form.get('applicationId')?.value,
    script: form.get('script')?.value,
    applications: form.get('applications')?.value,
    websites: form.get('websites')?.value,
    mobileApps: form.get('mobileApps')?.value
  });

  const syntheticType: string = test.configuration.syntheticType;

  const [testTypeSelected, setTestTypeSelected] = useState<TestTypeSelected>({
    api: {
      simple: syntheticType === 'HTTPAction',
      script: syntheticType === 'HTTPScript'
    },
    browser: {
      simple: syntheticType === 'WebpageAction',
      script: syntheticType === 'BrowserScript' || syntheticType === 'WebpageScript'
    },
    ssl: {
      simple: syntheticType === 'SSLCertificate'
    },
    dns: {
      simple: syntheticType === 'DNS'
    }
  });
  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState<SlideInHeader>({
    title: null,
    onClose: null
  });
  const [showAssertionsWarning, setShowAssertionsWarning] = useState(false);

  const getDefaultHeaders = (): ConfigItem[] => {
    const headers = form.get('configuration')?.get('headers')
      ? (form.get('configuration')?.get('headers') as Field<Record<string, string>>)?.value
      : {};
    const headersKeys = Object.keys(headers);
    if (headersKeys.length) {
      const headersObject: ConfigItem[] = [];
      headersKeys.forEach(key =>
        headersObject.push({
          id: generateUniqueShortId(),
          key: key,
          value: headers[key],
          error: {
            name: { invalid: false, message: '' },
            value: { invalid: false, message: '' }
          }
        })
      );
      return headersObject;
    } else {
      return [
        {
          id: generateUniqueShortId(),
          key: '',
          value: '',
          error: {
            name: { invalid: false, message: '' },
            value: { invalid: false, message: '' }
          }
        }
      ];
    }
  };
  const [headers, setHeaders] = useState(getDefaultHeaders());
  const [invalidHeader, setInvalidHeader] = useState({ invalid: false, message: '' });
  const [invalidJSON, setInvalidJSON] = useState({ invalid: false, message: '' });
  const [invalidTimeout, setInvalidTimeout] = useState({ invalid: false, message: '' });

  const getDefaultCustomProperties = (): ConfigItem[] => {
    const customProperties = (form.get('customProperties') as Field<Record<string, string>>).value;
    const customPropertyKeys = Object.keys(customProperties);
    if (customPropertyKeys.length) {
      const customPropertiesObject: ConfigItem[] = [];
      customPropertyKeys.forEach(key =>
        customPropertiesObject.push({
          id: generateUniqueShortId(),
          key: key,
          value: customProperties[key],
          error: {
            name: { invalid: false, message: '' },
            value: { invalid: false, message: '' }
          }
        })
      );
      return customPropertiesObject;
    } else {
      return [
        {
          id: generateUniqueShortId(),
          key: '',
          value: '',
          error: {
            name: { invalid: false, message: '' },
            value: { invalid: false, message: '' }
          }
        }
      ];
    }
  };
  const [customProperties, setCustomProperties] = useState(getDefaultCustomProperties());
  const [invalidCustomProperty, setInvalidCustomProperty] = useState({ invalid: false, message: '' });
  const [targetFilters, setTargetFilters] = useState(getTargetFilters(form, 'targetValues'));
  const [validationFilters, setValidationFilters] = useState(getTargetFilters(form, 'validationRules'));

  const formId = 'create-synthetics-test-form';

  const setSliderState = ({ slideInConfig, isVisible }: SliderState) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  function onSubmit(form: MapForm<any>, test: SyntheticTest) {
    clickSyntheticMonitoringConfigurationTabEditTracker(trackCta);
    setIsSubmitting(true);
    const testConfig = cleanConfigurationForm(form, test);

    updateTest(testConfig).once(
      () => {
        onClose();
        setReloadCount((count: number) => ++count);
        showUpdateSuccessMessage();
      },
      error => {
        onClose();
        setIsSubmitting(false);
        showUpdateErrorMessage(deserializeErrorMessage(error.message));
        logger.error(
          `failed to save updated test configuration : ${testConfig} ${deserializeErrorMessage(error.message)}`,
          error
        );
      }
    );
  }

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

  const isProceedDisabledAdvanced = () => {
    const configForm = form.get('configuration') as MapForm<any>;
    const syntheticTypeField = configForm.get('syntheticType') as Field<string>;
    const labelField = form.get('label') as Field<string>;
    const frequencyField = form.get('testFrequency') as Field<number>;
    if (
      isSubmitting ||
      // for HTTPAction and WebpageAction
      ((syntheticTypeField.value === 'HTTPAction' || syntheticTypeField.value === 'WebpageAction') &&
        configForm.get('url') &&
        !configForm.get('url').valid) ||
      (syntheticTypeField.value === 'HTTPAction' &&
        configForm.get('headers') &&
        headers.filter(
          header =>
            (header.error.name.invalid && !header.error.value.invalid) ||
            (!header.error.name.invalid && header.error.value.invalid)
        ).length > 0) ||
      invalidHeader.invalid ||
      (configForm.get('expectStatus') && !configForm.get('expectStatus').valid) ||
      invalidJSON.invalid ||
      (configForm.get('expectMatch') && !configForm.get('expectMatch').valid) ||
      // for HTTPScript, WebpageScript, and BrowserScript
      ((syntheticTypeField.value === 'HTTPScript' ||
        syntheticTypeField.value === 'WebpageScript' ||
        syntheticTypeField.value === 'BrowserScript') &&
        // Initially there isn't 'script'/ 'scripts' within configuration
        ((!configForm.get('script') && !configForm.get('scripts')) ||
          // validating js file if 'script' is present
          (configForm.get('script') && !configForm.get('script').valid) ||
          // validating zip file if 'scripts' is present
          (configForm.get('scripts') &&
            (!configForm.getIn(['scripts', 'bundle']).valid || !configForm.getIn(['scripts', 'scriptFile']).valid)))) ||
      // for SSL Certificate
      SSLCertificateErrorsExist(configForm, syntheticTypeField, validationFilters) ||
      // for DNS
      DNSErrorsExist(configForm, syntheticTypeField, targetFilters, showAssertionsWarning) ||
      !syntheticTypeField.valid ||
      !frequencyField.valid ||
      !labelField.valid ||
      customProperties.filter(
        property =>
          (property.error.name.invalid && !property.error.value.invalid) ||
          (!property.error.name.invalid && property.error.value.invalid)
      ).length > 0 ||
      invalidCustomProperty.invalid ||
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
        isSaving={isSubmitting}
        disabled={isProceedDisabledAdvanced()}
      >
        {t('in-synthetics:dialog.updateTest.buttonSave')}
      </SaveButton>
    </FormFooter>
  );

  const getDialogTitle = () => {
    if (testTypeSelected.browser.simple || testTypeSelected.browser.script) {
      return 'Browser';
    } else if (testTypeSelected.api.simple || testTypeSelected.api.script) {
      return 'API';
    } else if (testTypeSelected.ssl.simple) {
      return 'SSL Certificate';
    } else {
      return 'DNS';
    }
  };

  return (
    <DialogWithSlideInView
      footer={footer}
      title={t('in-synthetics:dialog.updateTest.dialogTitle', {
        syntheticType: getDialogTitle()
      })}
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
    >
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(form, test);
        }}
        className={classNames({
          [locals.form]: true,
          [locals.advancedMode]: true
        })}
      >
        <AdvancedMode
          form={form}
          updateForm={setForm}
          setSliderState={setSliderState}
          testTypeSelected={testTypeSelected}
          setTestTypeSelected={setTestTypeSelected}
          renderSectionsCounter={renderSectionsCounter}
          setRenderSectionsCounter={setRenderSectionsCounter}
          commonAttributes={commonAttributes}
          setCommonAttributes={setCommonAttributes}
          setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
          isUpdateConfig
          headers={headers}
          setHeaders={setHeaders}
          invalidHeader={invalidHeader}
          setInvalidHeader={setInvalidHeader}
          invalidJSON={invalidJSON}
          setInvalidJSON={setInvalidJSON}
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
      </form>
    </DialogWithSlideInView>
  );
}
