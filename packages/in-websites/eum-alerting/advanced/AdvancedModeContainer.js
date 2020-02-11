import React, { useState } from 'react';

import StatusCodeUseCaseSelection from 'in-websites/eum-alerting/advanced/AlertTrigger/StatusCodeUseCaseSelection';
import JsErrorsUseCaseSelection from 'in-websites/eum-alerting/advanced/AlertTrigger/JsErrorUseCaseSelection';
import TimeThresholdConfig from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/TimeThresholdConfig';
import AlertPropertiesContainer from 'in-websites/eum-alerting/advanced/AlertPropertiesContainer';
import AlertLocationFilters from 'in-websites/eum-alerting/components/AlertLocationFilters';
import AlertSelection from 'in-websites/eum-alerting/advanced/AlertTrigger/AlertSelection';
import SelectAlertChannel from 'in-websites/eum-alerting/components/SelectAlertChannel';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import SlownessChart from 'in-websites/eum-alerting/components/SlownessChart';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/formHelpers';
import ChartSwitch from 'in-websites/eum-alerting/components/ChartSwitch';
import ScrollStep from 'in-websites/eum-alerting/advanced/ScrollStep';
import SideNav from 'in-websites/eum-alerting/advanced/SideNav';
import { scrollIntoView } from 'in-services/util/dom';
import Button from 'in-new-components/Button/Button';
import Message from 'in-new-components/Message';

import locals from './AdvancedModeContainer.mless';
import theme from 'in-themes';

const idScrollContainer = 'eum-advanced-scroll-container';
let scrollContainerRef = React.createRef();

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
    { label: 'Scope', checked: true },
    {
      label: 'Trigger',
      checked: validateTrigger(form)
    },
    { label: 'Time Threshold', checked: true },
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
        ref={scrollContainerRef}
        onWheel={() => {
          highlightCurrentItemOnManualScroll(setIndexItemSelected, navItems);
        }}
      >
        <div className={locals.content}>
          <ScrollStep id={navItems[0].label} title="Scope: Where is the condition happening?">
            <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
          </ScrollStep>
          <ScrollStep id={navItems[1].label} title="Trigger: What do you want to be alerted on?">
            <AlertSelection form={form} onChange={onChange} />
            <ChartSwitch
              alertType={form.get(fieldNames.ruleAlertType).value}
              JsErrorsComponent={() => (
                <JsErrorsUseCaseSelection
                  form={form}
                  timeConfig={timeConfig}
                  onChange={onChange}
                  setJsErrorsListVisible={setSliderState}
                  granularity={granularity}
                />
              )}
              StatusCodeComponent={() => (
                <StatusCodeUseCaseSelection
                  form={form}
                  timeConfig={timeConfig}
                  onChange={onChange}
                  granularity={granularity}
                />
              )}
              SlownessComponent={() => {
                return (
                  <ChartContainer headline="onLoad Time (ms)" withBorder>
                    <>
                      <SlownessChart
                        form={form}
                        timeConfig={timeConfig}
                        granularity={granularity}
                        onChange={onChange}
                      />
                      {showInsufficientBaselineDataMessage(form) && (
                        <Message type="neutral" iconColor={theme.lib.colors.failure} withIcon small>
                          Insufficient data to compute the selected Baseline. Please select Static Threshold instead.
                        </Message>
                      )}
                    </>
                  </ChartContainer>
                );
              }}
            />
          </ScrollStep>
          <ScrollStep id={navItems[2].label} title="Time Threshold: When do you want to be alerted?">
            <TimeThresholdConfig form={form} onChange={onChange} />
          </ScrollStep>
          <ScrollStep id={navItems[3].label} title="Alert Channels: Who needs to be alerted?">
            <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
          </ScrollStep>
          <ScrollStep id={navItems[4].label} title="Additional Alert Properties (optional)" hideDevider>
            <AlertPropertiesContainer form={form} onChange={onChange} websiteLabel={websiteLabel} />
          </ScrollStep>
          <nav className={locals.controls} id={idScrollContainer}>
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

function validateTrigger(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;

  if (alertType === 'specificJsError') {
    return Boolean(form.get(fieldNames.ruleAlertType).value && getFormValueOrDefault(form, fieldNames.ruleValue));
  } else {
    return true;
  }
}

function showInsufficientBaselineDataMessage(form) {
  if (form.get(fieldNames.thresholdType).value === 'staticThreshold') {
    return false;
  }

  const baseline = form.get(fieldNames.thresholdBaseline).value;
  return baseline && baseline.length === 0;
}

function highlightCurrentItemOnManualScroll(setIndexItemSelected, navItems) {
  for (const [i, { label }] of navItems.entries()) {
    const element = document.getElementById(label);
    const { top, height } = element.getBoundingClientRect();

    if (top + height > scrollContainerRef.current.offsetTop) {
      setIndexItemSelected(i);
      break;
    }
  }

  // highlight last item because now the item before and the last one are shown in the scroll container
  const controls = document.getElementById(idScrollContainer);
  const containerBottomPos =
    scrollContainerRef.current.offsetHeight + scrollContainerRef.current.getBoundingClientRect().top;
  const controlsContainerHeight = controls.getBoundingClientRect().height;
  const controlsContainerTopPos = controls.getBoundingClientRect().top;
  if (Math.trunc(containerBottomPos - controlsContainerHeight) === Math.trunc(controlsContainerTopPos)) {
    setIndexItemSelected(navItems.length - 1);
  }
}
