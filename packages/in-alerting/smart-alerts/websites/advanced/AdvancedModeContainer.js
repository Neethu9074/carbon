/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  websitesAlertingAdditionalPropsAlertLevelChanged,
  websitesAlertingAdditionalPropsDescriptionChanged,
  websitesAlertingAdditionalPropsTriggerChanged,
  websitesAlertingBlueprintChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer';
import { default as GlobalAdvancedModeContainer } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeContainer';
import {
  getFormValueOrDefault,
  getDescriptionPlaceholder,
  getTitlePlaceholder
} from 'in-alerting/smart-alerts/websites/form/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/websites/components/AlertTagFilterExpressionConfig';
import WebsiteAlertPropertiesTitleRow from 'in-alerting/smart-alerts/websites/advanced/WebsiteAlertPropertiesTitleRow';
import BlueprintSelection from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/BlueprintSelection';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/ThroughputInteractiveChart';
import BaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/BaselineErrorMessage';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/SlownessInteractiveChart';
import JsErrorsInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/JsErrorsInteractiveChart';
import { validateCheckForCustomPayload } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import TimeThresholdConfig from 'in-alerting/smart-alerts/websites/advanced/TimeThresholdConfig';
import ProvideStatusCode from 'in-alerting/smart-alerts/websites/components/ProvideStatusCode';
import { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import createBlueprintForm from 'in-alerting/smart-alerts/websites/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import ProvideJsError from 'in-alerting/smart-alerts/websites/components/ProvideJsError';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/constants';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    form,
    websiteLabel,
    timeConfig,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    updateForm,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    QueryBuilderComponent,
    isTagFilterFormModelValid,
    editMode
  } = props;
  const alertType = form.get('rule').get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.websites.advanced.scopeLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.scopeTitle'),
          content: (
            <>
              <AlertTagFilterExpressionConfig
                form={form}
                updateForm={updateForm}
                websiteLabel={websiteLabel}
                QueryBuilderComponent={QueryBuilderComponent}
              />
            </>
          ),
          checked: true,
          valid: true
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.websites.advanced.triggerLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.triggerTitle'),
          checked: validateTrigger(form),
          valid: formFieldsValid(form, ['rule', 'threshold']),
          content: (
            <>
              <BlueprintSelection
                form={form}
                updateForm={updateForm}
                blueprintConfigs={blueprintConfigs}
                createBlueprintForm={createBlueprintForm}
                trackBlueprintChange={newBlueprint =>
                  websitesAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })
                }
              />
              <AlertTypeSwitch
                alertType={alertType}
                renderJsErrors={() => (
                  <>
                    <LightCard
                      title={t('in-alerting:smartAlerts.websites.advanced.JSErrorMessage')}
                      withoutPadding
                      darkFrame
                    >
                      <ProvideJsError
                        form={form}
                        timeConfig={{
                          windowSize: alertingDialogItemPickerTimeframe
                        }}
                        updateForm={updateForm}
                        onSelectJsError={setSliderState}
                        mode={modeAdvanced}
                      />
                    </LightCard>
                    <JsErrorsInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                      editMode={editMode}
                    />
                  </>
                )}
                renderSlowness={() => (
                  <>
                    <SlownessInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                      editMode={editMode}
                    />
                  </>
                )}
                renderStatusCode={() => (
                  <>
                    <LightCard
                      title={t('in-alerting:smartAlerts.websites.advanced.HTTPStatusCode')}
                      withoutPadding
                      darkFrame
                    >
                      <ProvideStatusCode form={form} updateForm={updateForm} mode={modeAdvanced} />
                    </LightCard>
                    <StatusCodeInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      onChange={onChange}
                      updateForm={updateForm}
                      timeConfig={timeConfig}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                      editMode={editMode}
                    />
                  </>
                )}
                renderThroughput={() => (
                  <>
                    <ThroughputInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                      editMode={editMode}
                    />
                  </>
                )}
              />
              {blueprintConfig.baselineEnabled && <BaselineErrorMessage thresholdResult={thresholdResult} />}
            </>
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.websites.advanced.timeThresholdLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.timeThresholdTitle'),
          checked: true,
          valid: true,
          content: (
            <TimeThresholdConfig
              form={form}
              onChange={onChange}
              updateForm={updateForm}
              impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
              hasUserImpactOption
            />
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.websites.advanced.alertChannelsLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.alertChannelsTitle'),
          checked: form.get(fieldNames.alertChannelIds).value.length > 0,
          valid: true,
          content: (
            <ConfigureAlertChannel
              form={form}
              onChange={onChange}
              setSliderState={setSliderState}
              setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
              numberOfAlertChannelListRows={7}
            />
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.websites.advanced.propertiesLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.propertiesTitle'),
          checked: !!(form.get(fieldNames.name).value || form.get(fieldNames.description).value),
          valid: true,
          content: (
            <AlertPropertiesContainer
              renderAlertProperties={() => (
                <AlertProperties
                  form={form}
                  onChange={onChange}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  getPreviewTitlePlaceholder={getTitlePlaceholder}
                  trackAlertLevelChanged={websitesAlertingAdditionalPropsAlertLevelChanged}
                  trackDescriptionChanged={websitesAlertingAdditionalPropsDescriptionChanged}
                  trackTriggerChanged={websitesAlertingAdditionalPropsTriggerChanged}
                  renderAlertPopertiesTitleRow={() => (
                    <WebsiteAlertPropertiesTitleRow form={form} onChange={onChange} />
                  )}
                />
              )}
              renderAlertPreview={() => (
                <AlertPreview
                  form={form}
                  label={websiteLabel}
                  entityIconType="lib_website"
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  renderHeadline={() => (
                    <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder(form)} />
                  )}
                />
              )}
            />
          )
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.websites.advanced.payloadsLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.payloadsTitle'),
          checked: validateCheckForCustomPayload(form),
          valid: true,
          content: <AlertConfigCustomPayload form={form} setForm={updateForm} />
        }
      ]}
      additionalValidationCheck={() => isTagFilterFormModelValid}
    />
  );
}

function validateTrigger(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;

  if (alertType === 'specificJsError') {
    return Boolean(ruleForm.get('alertType').value && getFormValueOrDefault(ruleForm, 'value'));
  } else {
    return true;
  }
}

function formFieldsValid(form, fieldsToCheck) {
  const fieldInvalid = Object.entries(form?.items ?? {})
    .filter(([field]) => fieldsToCheck?.includes(field))
    .some(([, { hierarchyValid }]) => !hierarchyValid);
  return !fieldInvalid;
}
