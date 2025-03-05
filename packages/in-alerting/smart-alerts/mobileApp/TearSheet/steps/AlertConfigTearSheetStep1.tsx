/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import SelectedBlueprintPresenter from 'in-alerting/smart-alerts/components/BlueprintFormMultistep/SelectedBlueprintPresenter';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import createBlueprintForm from 'in-alerting/smart-alerts/mobileApp/form/blueprintFormCreator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import AlertTypeSwitch from 'in-alerting/smart-alerts/mobileApp/components/AlertTypeSwitch';
import ProvideCustomEvent from 'in-alerting/smart-alerts/eum/components/ProvideCustomEvent';
import { blueprintConfigs } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import ProvideStatusCode from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import CustomEventList from 'in-alerting/smart-alerts/eum/components/CustomEventList';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { eumType, modeSimple } from 'in-alerting/smart-alerts/mobileApp/constants';
import {} from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Menu from 'in-alerting/smart-alerts/components/Menu';
import { t } from 'in-i18n';

export default function AlertConfigTearSheetStep1({
  form,
  updateForm
}: {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}) {
  const alertType = form.get('rule').get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.mobileApp.tearSheet.step1.description')} hideSpace>
      <Menu
        items={blueprintConfigs}
        onItemClick={item => {
          updateForm(createBlueprintForm(form, item.type, item.thresholdDefaults, item.defaultMetric, false));
        }}
        initialItemSelected={blueprintConfig}
        direction="horizontal"
        addRightSeparator
      />
      <AlertTypeSwitch
        alertType={alertType}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter
            title={(blueprintConfig as any).tearSheet.headline}
            description={(blueprintConfig as any).tearSheet.text}
          >
            <ProvideStatusCode form={form} updateForm={updateForm} tearSheetView />
          </SelectedBlueprintPresenter>
        )}
        renderThroughput={() => (
          <SelectedBlueprintPresenter
            title={(blueprintConfig as any).tearSheet.headline}
            description={(blueprintConfig as any).tearSheet.text}
            isBeta={false}
          />
        )}
        renderCustomEvent={() => (
          <SelectedBlueprintPresenter title={blueprintConfig.headline ?? ''} description={blueprintConfig.text}>
            <ExpandableLightCard
              title={
                <AlertTypography
                  variant="heading-100"
                  content={t('in-alerting:smartAlerts.mobileApp.data.customEventBlueprintConfigName')}
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
                mode={modeSimple}
                eumType={eumType}
                tearSheetView
              />
            </ExpandableLightCard>
          </SelectedBlueprintPresenter>
        )}
        renderCrash={() => (
          <SelectedBlueprintPresenter
            title={(blueprintConfig as any).tearSheet.headline}
            description={(blueprintConfig as any).tearSheet.text}
            isBeta={false}
          />
        )}
      />
    </TearSheetStepTitleWrapper>
  );
}
