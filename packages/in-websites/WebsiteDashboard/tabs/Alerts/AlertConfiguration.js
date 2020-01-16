import React, { useState } from 'react';

import StatusCodeUseCaseSelection from 'in-websites/eum-alerting/advanced/AlertTrigger/StatusCodeUseCaseSelection';
import JsErrorsUseCaseSelection from 'in-websites/eum-alerting/advanced/AlertTrigger/JsErrorUseCaseSelection';
import SelectAlertChannelPresenter from 'in-websites/eum-alerting/components/SelectAlertChannelPresenter';
import alertFormDefinition, { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import AlertLocationFilters from 'in-websites/eum-alerting/components/AlertLocationFilters';
import AlertProperties from 'in-websites/eum-alerting/advanced/AlertProperties';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import ExpandableCard from 'in-new-components/ExpandableCard';
import ListTitle from 'in-new-components/lists/Title';
import Card from 'in-new-components/Card';

import locals from './AlertConfiguration.mless';

const oneMinute = 60 * 1000;
const oneDay = 24 * 60 * oneMinute;

export default function AlertConfiguration({ alertConfig, websiteLabel }) {
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig));
  const [, setSlideInViewVisible] = useState(false);
  const [, setSlideInConfig] = useState(null);

  const onChange = createOnChange(setForm);
  const granularity = 10 * oneMinute;
  const setSliderState = createSetSliderState(setSlideInConfig, setSlideInViewVisible);
  const timeConfig = {
    windowSize: oneDay
  };

  const props = {
    form,
    onChange,
    timeConfig
  };

  return (
    <>
      <ListTitle>Alert configuration</ListTitle>

      <Card title="Trigger" withoutPadding darkFrame>
        <ChartSwitch
          alertType={form.get(fieldNames.ruleAlertType).value}
          JsErrorsComponent={() => (
            <JsErrorsUseCaseSelection
              {...props}
              granularity={granularity}
              isReadOnly
              setJsErrorsListVisible={setSliderState}
            />
          )}
          StatusCodeComponent={() => (
            <StatusCodeUseCaseSelection
              {...props}
              granularity={granularity}
              isReadOnly
              setJsErrorsListVisible={setSliderState}
            />
          )}
          SlownessComponent={() => (
            <ChartContainer headline="onLoad Time (ms)" withBorder={false}>
              <SlownessChart {...props} isReadOnly granularity={granularity} />
            </ChartContainer>
          )}
        />
      </Card>

      <ExpandableCard title="Domain" openByDefault bodyWithoutPadding darkFrame>
        <div className={locals.wrapper}>
          <AlertLocationFilters {...props} isReadOnly granularity={granularity} websiteLabel={websiteLabel} />
          <div className={locals.overlay} />
        </div>
      </ExpandableCard>

      <ExpandableCard title="Alert Channels" darkFrame openByDefault bodyWithoutPadding>
        <div className={locals.alertChannelsWrapper}>
          <SelectAlertChannelPresenter
            isSearchable={false}
            getHeader={() => null}
            rightHeader={null}
            tableActions={[]}
            {...props}
          />
        </div>
      </ExpandableCard>

      <ExpandableCard title="Alert Properties" openByDefault bodyWithoutPadding darkFrame>
        <AlertProperties {...props} isReadOnly granularity={granularity} websiteLabel={websiteLabel} />
      </ExpandableCard>
    </>
  );
}

function createOnChange(setForm) {
  return (form, fieldName, fieldValue, ...atomicAddFields) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (atomicAddFields.length > 0) {
      atomicAddFields.forEach(
        ({ name, value }) => (updatedForm = updatedForm.updateIn([name], field => field.setValue(value)))
      );
    }

    setForm(updatedForm);
  };
}

function createSetSliderState(setSlideInConfig, setSlideInViewVisible) {
  return ({ slideInConfig, isVisible }) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };
}
