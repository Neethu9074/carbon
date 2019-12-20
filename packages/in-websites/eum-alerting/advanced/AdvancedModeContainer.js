import React, { useState } from 'react';

import JsErrorSelection from 'in-websites/eum-alerting/advanced/AlertTrigger/JsErrorSelection';
import AlertLocationFilters from 'in-websites/eum-alerting/components/AlertLocationFilters';
import AlertSelection from 'in-websites/eum-alerting/advanced/AlertTrigger/AlertSelection';
import SelectAlertChannel from 'in-websites/eum-alerting/components/SelectAlertChannel';
import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/AlertConfigDialog';
import AlertProperties from 'in-websites/eum-alerting/advanced/AlertProperties';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import ScrollStep from 'in-websites/eum-alerting/advanced/ScrollStep';
import { scrollIntoView, getCoords } from 'in-services/util/dom';
import SideNav from 'in-websites/eum-alerting/advanced/SideNav';
import Button from 'in-new-components/Button/Button';
import Message from 'in-new-components/Message';

import locals from './AdvancedModeContainer.mless';

export default function AdvancedModeContainer({
  form,
  websiteLabel,
  timeConfig,
  onChange,
  onClose,
  onCreate,
  setSliderState,
  granularity,
  editMode
}) {
  const navItems = [
    { label: 'Domain', checked: true },
    {
      label: 'Trigger',
      checked: validateTrigger(form)
    },
    { label: 'Alert Channels', checked: form.get(fieldNames.alertChannelIds).value.length > 0 },
    {
      label: 'Properties (optional)',
      checked: !!(form.get(fieldNames.name).value || form.get(fieldNames.description).value)
    }
  ];

  const [indexItemSelected, setIndexItemSelected] = useState(0);

  return (
    <div className={locals.container}>
      <div
        className={locals.scrollWrapper}
        onScroll={() => {
          setIndexIfElementOnTop(navItems[0].label, setIndexItemSelected, 0);
          setIndexIfElementOnTop(navItems[1].label, setIndexItemSelected, 1);
          setIndexIfElementOnTop(navItems[2].label, setIndexItemSelected, 2);
          setIndexIfElementOnTop(navItems[3].label, setIndexItemSelected, 3);
        }}
      >
        <div className={locals.content}>
          <ScrollStep id={navItems[0].label} title="Domain: Where is the condition happening?">
            <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
          </ScrollStep>
          <ScrollStep id={navItems[1].label} title="Trigger: What do you want to be alerted on?">
            <AlertSelection form={form} onChange={onChange} />
            <ChartSwitch
              alertType={form.get(fieldNames.ruleAlertType).value}
              JsErrorsComponent={() => (
                <JsErrorSelection
                  form={form}
                  timeConfig={timeConfig}
                  onChange={onChange}
                  setJsErrorsListVisible={setSliderState}
                  granularity={granularity}
                />
              )}
              SlownessComponent={() => {
                const baseline = form.get(fieldNames.thresholdBaseline).value;
                return (
                  <ChartContainer headline="onLoad Time (ms)" withBorder>
                    <>
                      <SlownessChart
                        form={form}
                        timeConfig={timeConfig}
                        granularity={granularity}
                        onChange={onChange}
                      />
                      {baseline &&
                        baseline.length === 0 &&
                        form.get(fieldNames.thresholdType).value !== 'staticThreshold' && (
                          <Message withIcon small>
                            Insufficient data to compute a baseline for the selected configuration.
                          </Message>
                        )}
                    </>
                  </ChartContainer>
                );
              }}
            />
          </ScrollStep>
          <ScrollStep id={navItems[2].label} title="Alert Channels: Who needs to be alerted?">
            <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
          </ScrollStep>
          <ScrollStep id={navItems[3].label} title="Additional Alert Properties (optional)" hideDevider>
            <AlertProperties form={form} onChange={onChange} websiteLabel={websiteLabel} />
          </ScrollStep>
          <nav className={locals.controls}>
            <Button className={locals.button} kind="secondary" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button
              className={locals.button}
              onClick={() => onCreate()}
              disabled={form.touched && !form.hierarchyValid}
            >
              {editMode ? 'Save' : 'Create'}
            </Button>
          </nav>
        </div>
      </div>
      <div className={locals.sideNav}>
        <SideNav
          navItems={navItems}
          itemClickTracker={(i, label) => scrollIntoView(document.getElementById(label), { behavior: 'smooth' })}
          initialItemSelected={indexItemSelected}
        />
      </div>
    </div>
  );
}

function setIndexIfElementOnTop(label, setIndexItemSelected, index) {
  const element = document.getElementById(label);
  if (element) {
    const { top } = getCoords(element);
    if (top < 130 && top > 70) setIndexItemSelected(index);
  }
}

function validateTrigger(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;

  if (alertType === 'specificJsError') {
    return Boolean(form.get(fieldNames.ruleAlertType).value && getFormValueOrDefault(form, fieldNames.ruleValue));
  } else {
    return true;
  }
}
