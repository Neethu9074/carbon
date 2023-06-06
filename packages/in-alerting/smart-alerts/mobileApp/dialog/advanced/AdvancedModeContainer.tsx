/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

//@ts-expect-error needs TS migration
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
//@ts-expect-error needs TS migration
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
//@ts-expect-error needs TS migration
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/eum/components/AlertPropertiesTitleRow';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
//@ts-expect-error
import BluePrintSelectionSection from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/BluePrintSelectionSection';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/mobileApp/form/formUtils';
import TimeThresholdConfig from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/TimeThresholdConfig';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import { fieldTouchedAndInvalid } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import useMobileApp from 'in-mobile-apps/hooks/useMobileApp';
import StepsContainer from 'in-components/StepsContainer';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const { form, onChange, setSliderState, updateForm, setCustomSlideInHeaderConfig } = props;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  const mobileAppId = form.get('mobileAppId')?.value;
  const [mobileApp] = useMobileApp(mobileAppId);

  return (
    <StepsContainer
      messages={[]}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.triggerLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.triggerTitle'),
          valid: true,
          content: (
            <>
              <BluePrintSelectionSection
                alertType={alertType}
                form={form}
                updateForm={updateForm}
                setSliderState={setSliderState}
              />
            </>
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.timeThresholdLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.timeThresholdTitle'),
          valid:
            !fieldTouchedAndInvalid(form.get('timeThreshold')?.get('users')) &&
            !fieldTouchedAndInvalid(form.get('timeThreshold')?.get('userPercentage')),
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
          scrollId: '5',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.alertChannelsLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.alertChannelsTitle'),
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
          scrollId: '6',
          label: t('in-alerting:smartAlerts.mobileApp.advanced.propertiesLabel'),
          title: t('in-alerting:smartAlerts.mobileApp.advanced.propertiesTitle'),
          valid: true,
          content: (
            <AlertPropertiesContainer
              renderAlertProperties={() => (
                <AlertProperties
                  form={form}
                  onChange={onChange}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  getPreviewTitlePlaceholder={getTitlePlaceholder}
                  renderAlertPropertiesTitleRow={() => (
                    <AlertPropertiesTitleRow
                      form={form}
                      onChange={onChange}
                      getTitlePlaceholder={getTitlePlaceholder}
                    />
                  )}
                />
              )}
              renderAlertPreview={() => (
                <AlertPreview
                  form={form}
                  renderHeadline={() => (
                    <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder(form)} />
                  )}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  entityLabel={mobileApp?.label}
                  entityIconType="lib_mobile_app"
                />
              )}
            />
          )
        }
      ]}
    />
  );
}
