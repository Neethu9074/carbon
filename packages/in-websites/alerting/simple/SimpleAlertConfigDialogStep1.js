import PropTypes from 'prop-types';
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/Alerting/simple/SimpleModeStepContentWrapper';
import SelectedBlueprintPresenter from 'in-new-components/Alerting/simple/SelectedBlueprintPresenter';
import SimpleAlertConfigDialogChart from 'in-websites/alerting/simple/SimpleAlertConfigDialogChart';
import { BlueprintDescription } from 'in-new-components/Alerting/components/BlueprintDescription';
import { alertingDialogItemPickerTimeframe, modeSimple } from 'in-websites/alerting/constants';
import ProvideStatusCode from 'in-websites/alerting/components/ProvideStatusCode';
import createBlueprintForm from 'in-websites/alerting/form/blueprintFormCreator';
import { websitesAlertingBlueprintChanged } from 'in-websites/alerting/tracker';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import ProvideJsError from 'in-websites/alerting/components/ProvideJsError';
import { blueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import Menu from 'in-new-components/Alerting/components/Menu';

export default function SimpleAlertConfigDialogStep1({
  form,
  granularity,
  onChange,
  setJsErrorsListVisible,
  timeConfig,
  updateForm
}) {
  const alertType = form.get('rule').get('alertType').value;
  const selectedBlueprintConfig = blueprintConfig.find(item => item.type === alertType);

  return (
    <SimpleModeStepContentWrapper headline="What do you want to be alerted on?">
      <Menu
        items={blueprintConfig}
        onItemClick={item => {
          updateForm(
            createBlueprintForm(form, item.type).updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f =>
              f.setValue(true)
            )
          );

          websitesAlertingBlueprintChanged({ newBluePrint: alertType, mode: modeSimple });
        }}
        initialItemSelected={selectedBlueprintConfig}
        addRightSeparator
      />

      <AlertTypeSwitch
        alertType={alertType}
        renderJsErrors={() => (
          <SelectedBlueprintPresenter
            title={selectedBlueprintConfig.headline}
            description={selectedBlueprintConfig.text}
          >
            <ProvideJsError
              form={form}
              updateForm={updateForm}
              onSelectJsError={setJsErrorsListVisible}
              timeConfig={{
                windowSize: alertingDialogItemPickerTimeframe
              }}
              mode={modeSimple}
            />
          </SelectedBlueprintPresenter>
        )}
        renderSlowness={() => <BlueprintDescription config={selectedBlueprintConfig} isSimpleMode />}
        renderStatusCode={() => (
          <SelectedBlueprintPresenter
            title={selectedBlueprintConfig.headline}
            description={selectedBlueprintConfig.text}
          >
            <ProvideStatusCode form={form} onChange={onChange} updateForm={updateForm} mode={modeSimple} />
          </SelectedBlueprintPresenter>
        )}
      />

      <SimpleAlertConfigDialogChart form={form} granularity={granularity} timeConfig={timeConfig} />
    </SimpleModeStepContentWrapper>
  );
}

SimpleAlertConfigDialogStep1.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  setJsErrorsListVisible: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
