import { compose, withProps } from 'recompose';
import React from 'react';

import {
  applicationsAlertingAdditionalPropsAlertLevelChanged,
  applicationsAlertingAdditionalPropsDescriptionChanged,
  applicationsAlertingAdditionalPropsTitleChanged,
  applicationsAlertingAdditionalPropsTriggerChanged
} from 'in-applications/alerting/tracker';
import TimeThresholdConfigPresenter from 'in-new-components/Alerting/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-new-components/Alerting/advanced/AlertProperties/AlertPropertiesContainer';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-applications/alerting/form/formUtils';
import ApplicationAlertTypeSwitch from 'in-applications/alerting/components/ApplicationAlertTypeSwitch';
import AdvancedModeContainer from 'in-new-components/Alerting/advanced/AdvancedModeContainer';
import SelectAlertChannel from 'in-new-components/Alerting/components/SelectAlertChannel';

export default compose(
  withProps(({ form, onChange, setSliderState, updateForm }) => ({
    navItems: [
      {
        scrollId: '1',
        label: 'Scope',
        title: 'Scope: Where is the condition happening?',
        content: <h1>TODO: Add filters here</h1>,
        checked: true
      },
      {
        scrollId: '2',
        label: 'Trigger',
        title: 'Trigger: What do you want to be alerted on?',
        checked: true,
        content: (
          <>
            <h1>TODO: Add AlertSelection here</h1>

            <ApplicationAlertTypeSwitch
              alertType={form.get('rule').get('alertType').value}
              ErrorRateComponent={() => <h1>TODO: Add ErorrateComponent here</h1>}
            />
          </>
        )
      },
      {
        scrollId: '3',
        label: 'Time Threshold',
        title: 'Time Threshold: When do you want to be alerted?',
        checked: true,
        content: <TimeThresholdConfigPresenter form={form} onChange={onChange} updateForm={updateForm} />
      },
      {
        scrollId: '4',
        label: 'Alert Channels',
        title: 'Alert Channels: Who needs to be alerted?',
        checked: form.get('alertChannelIds').value.length > 0,
        content: <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
      },
      {
        scrollId: '5',
        label: 'Properties (optional)',
        title: 'Additional Alert Properties (optional)',
        checked: Boolean(form.get('name').value || form.get('description').value),
        content: (
          <AlertPropertiesContainer
            form={form}
            onChange={onChange}
            label={form.get('name').value}
            getDescriptionPlaceholder={getDescriptionPlaceholder}
            getTitlePlaceholder={getTitlePlaceholder}
            trackAlertLevelChanged={applicationsAlertingAdditionalPropsAlertLevelChanged}
            trackDescriptionChanged={applicationsAlertingAdditionalPropsDescriptionChanged}
            trackTitleChanged={applicationsAlertingAdditionalPropsTitleChanged}
            trackTriggerChanged={applicationsAlertingAdditionalPropsTriggerChanged}
          />
        )
      }
    ]
  }))
)(AdvancedModeContainer);
