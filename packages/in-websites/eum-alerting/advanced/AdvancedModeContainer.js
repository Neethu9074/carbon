import React from 'react';

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
import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button/Button';
import SideNav from 'in-new-components/SideNav';
import Message from 'in-new-components/Message';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AdvancedModeContainer.mless';
import theme from 'in-themes';

const idScrollContainer = 'eum-advanced-scroll-container';
let scrollContainerRef = React.createRef();

export default function AdvancedModeContainer(props) {
  const { form, websiteLabel, timeConfig, onChange, onClose, onCreate, setSliderState, granularity, editMode } = props;

  const navItems = [
    {
      scrollId: '1',
      label: 'Scope',
      title: 'Scope: Where is the condition happening?',
      content: (
        <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
      ),
      checked: true
    },
    {
      scrollId: '2',
      label: 'Trigger',
      title: 'Trigger: What do you want to be alerted on?',
      checked: validateTrigger(form),
      content: (
        <>
          <AlertSelection form={form} onChange={onChange} />
          <ChartSwitch
            alertType={form.get(fieldNames.ruleAlertType).value}
            JsErrorsComponent={() => (
              <ChartContainer headline="Specific JS Errors (Selection)" withBorder>
                <JsErrorsUseCaseSelection
                  form={form}
                  timeConfig={timeConfig}
                  onChange={onChange}
                  setJsErrorsListVisible={setSliderState}
                  granularity={granularity}
                />
              </ChartContainer>
            )}
            StatusCodeComponent={() => (
              <ChartContainer headline="Specific HTTP Status Codes" withBorder>
                <StatusCodeUseCaseSelection
                  form={form}
                  timeConfig={timeConfig}
                  onChange={onChange}
                  granularity={granularity}
                />
              </ChartContainer>
            )}
            SlownessComponent={() => {
              return (
                <ChartContainer headline="onLoad Time (ms)" withBorder>
                  <>
                    <SlownessChart form={form} timeConfig={timeConfig} granularity={granularity} onChange={onChange} />
                    {showInsufficientBaselineDataMessage(form) && (
                      <Message type="neutral" iconColor={theme.lib.colors.failure} withIcon>
                        Insufficient data to compute the selected baseline. Please select <i>Static Threshold</i>{' '}
                        instead.
                      </Message>
                    )}
                  </>
                </ChartContainer>
              );
            }}
          />
        </>
      )
    },
    {
      scrollId: '3',
      label: 'Time Threshold',
      title: 'Time Threshold: When do you want to be alerted?',
      checked: true,
      content: <TimeThresholdConfig form={form} onChange={onChange} />
    },
    {
      scrollId: '4',
      label: 'Alert Channels',
      title: 'Alert Channels: Who needs to be alerted?',
      checked: form.get(fieldNames.alertChannelIds).value.length > 0,
      content: <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
    },
    {
      scrollId: '5',
      label: 'Properties (optional)',
      title: 'Additional Alert Properties (optional)',
      checked: !!(form.get(fieldNames.name).value || form.get(fieldNames.description).value),
      content: <AlertPropertiesContainer form={form} onChange={onChange} websiteLabel={websiteLabel} />
    }
  ];

  return (
    <div className={locals.container}>
      <div className={locals.scrollWrapper} ref={scrollContainerRef}>
        <div className={locals.content}>
          {navItems.map(({ scrollId, label, title, content }) => (
            <ScrollStep key={label} id={scrollId}>
              <h2 className={locals.title}>{title}</h2>
              {content}
              <div className={locals.divider} />
            </ScrollStep>
          ))}

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
        <SideNav navItems={navItems} renderPostIcon={renderIcon} />
      </div>
    </div>
  );
}

function renderIcon({ checked }) {
  return (
    <SvgIcon
      className={evaluateClassNames({
        [locals.icon]: true,
        [locals.checked]: checked
      })}
      type="lib_check"
      size="xxs"
    />
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
