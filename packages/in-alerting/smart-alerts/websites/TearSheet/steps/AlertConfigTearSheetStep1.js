/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo } from 'react';

import SelectedBlueprintPresenter from 'in-alerting/smart-alerts/components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import createBlueprintForm from 'in-alerting/smart-alerts/websites/form/blueprintFormCreator';
import ProvideCustomEvent from 'in-alerting/smart-alerts/eum/components/ProvideCustomEvent';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import { blueprintConfigs } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import ProvideStatusCode from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import ProvideJsError from 'in-alerting/smart-alerts/websites/components/ProvideJsError';
import CustomEventList from 'in-alerting/smart-alerts/eum/components/CustomEventList';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import JsErrorsList from 'in-alerting/smart-alerts/websites/components/JsErrorsList';
import { getConfig } from 'in-alerting/smart-alerts/eum/utils/eumCommon';
import { eumType } from 'in-alerting/smart-alerts/websites/constants';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Menu from 'in-alerting/smart-alerts/components/Menu';
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep1({ form, updateForm, blueprintConfig }) {
  const alertType = form.get('rule').get('alertType').value;

  const blueprintConfigForTearSheet = useMemo(() => {
    return getConfig(blueprintConfigs);
  }, []);

  return (
    <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.websites.tearSheet.step1.description')} hideSpace>
      <Menu
        items={blueprintConfigForTearSheet}
        onItemClick={item => {
          updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, false));
        }}
        initialItemSelected={blueprintConfig}
        direction="horizontal"
      />
      <AlertTypeSwitch
        alertType={alertType}
        renderSlowness={() => (
          <SelectedBlueprintPresenter
            title={blueprintConfig.tearSheet.headline}
            description={blueprintConfig.tearSheet.text}
            isBeta={false}
          />
        )}
        renderJsErrors={() => (
          <SelectedBlueprintPresenter
            title={blueprintConfig.tearSheet.headline}
            description={blueprintConfig.tearSheet.text}
          >
            <ExpandableLightCard
              title={
                <AlertTypography
                  variant="heading-100"
                  content={t('in-alerting:smartAlerts.websites.tearSheet.JsErrors.name')}
                />
              }
              useMaxAvailableHeight={false}
              openByDefault
              darkFrame
              isTearSheetView
            >
              <JsErrorsList
                websiteId={form.get('websiteId').value}
                tagFilterExpression={form.get('tagFilterExpression').value}
                timeConfig={{
                  windowSize: alertingDialogItemPickerTimeframe
                }}
                onJsErrorSelect={message => {
                  updateForm(
                    form
                      .updateIn(['rule', 'value'], f => f.setValue(message).setTouched(true))
                      .updateIn(['rule', 'operator'], field => field.setValue(operators.EQUALS).setTouched(true))
                  );
                }}
                slideOut={() => undefined}
              />
              <ProvideJsError
                form={form}
                timeConfig={{
                  windowSize: alertingDialogItemPickerTimeframe,
                  autoRefresh: false
                }}
                updateForm={updateForm}
                mode="Advanced"
                tearSheetView
              />
            </ExpandableLightCard>
          </SelectedBlueprintPresenter>
        )}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter
            title={blueprintConfig.tearSheet.headline}
            description={blueprintConfig.tearSheet.text}
          >
            <ProvideStatusCode form={form} updateForm={updateForm} tearSheetView />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => (
          <SelectedBlueprintPresenter
            title={blueprintConfig.tearSheet.headline}
            description={blueprintConfig.tearSheet.text}
            isBeta={false}
          />
        )}
        renderCustomEvent={() => (
          <SelectedBlueprintPresenter
            title={blueprintConfig.tearSheet.headline}
            description={blueprintConfig.tearSheet.text}
          >
            <ExpandableLightCard
              title={
                <AlertTypography
                  variant="heading-100"
                  content={t('in-alerting:smartAlerts.websites.data.customEventBlueprintConfigName')}
                />
              }
              useMaxAvailableHeight={false}
              openByDefault
              darkFrame
              isTearSheetView
            >
              <CustomEventList
                eumType={eumType}
                timeConfig={{
                  windowSize: alertingDialogItemPickerTimeframe,
                  autoRefresh: false
                }}
                form={form}
                updateForm={updateForm}
              />

              <ProvideCustomEvent
                form={form}
                timeConfig={{
                  windowSize: alertingDialogItemPickerTimeframe,
                  autoRefresh: false
                }}
                updateForm={updateForm}
                onSelectCustomEvent={() => undefined}
                mode="Advanced"
                eumType={eumType}
                tearSheetView
              />
            </ExpandableLightCard>
          </SelectedBlueprintPresenter>
        )}
      />
    </TearSheetStepTitleWrapper>
  );
}
