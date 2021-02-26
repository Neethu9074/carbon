/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

const EventTypesSwitcher = connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  ({ form, types, onChange, formGroupStyles, isInternalVisible }) => (
    <Fragment>
      <h3>{t('in-settings:tabs.eventTypes')}</h3>
      <FormGroup noFlex className={formGroupStyles}>
        <EventType onChange={onChange} types={types} type="incident" label={t('in-settings:tabs.incidents')} />
        <EventType onChange={onChange} types={types} type="critical" label={t('in-settings:tabs.criticalIssues')} />
        <EventType onChange={onChange} types={types} type="warning" label={t('in-settings:tabs.warningIssues')} />
        <EventType onChange={onChange} types={types} type="change" label={t('in-settings:tabs.changes')} />
        <EventType onChange={onChange} types={types} type="online" label={t('in-settings:tabs.online')} />
        <EventType onChange={onChange} types={types} type="offline" label={t('in-settings:tabs.offline')} />
        {(isInternalVisible || agentMonitoringIssuesEnabled) && (
          <EventType
            onChange={onChange}
            types={types}
            type="agent_monitoring_issue"
            label={t('in-settings:tabs.monitoringIssues')}
          />
        )}
      </FormGroup>
      <TouchedMessages field={form.get('eventTypes')} />
    </Fragment>
  )
);

function EventType({ onChange, types, type, label }) {
  return (
    <HorizontalFormGroup noHelpTextSpacer>
      <Label htmlFor={`event-type-${type}`}>{label}</Label>
      <Toggle
        id={`event-type-${type}`}
        checked={types.includes(type)}
        onChange={() => onSelectChanged(types, onChange, type)}
      />
    </HorizontalFormGroup>
  );
}

function onSelectChanged(types, onChange, type) {
  if (types.includes(type)) {
    types = types.delete(types.indexOf(type));
  } else {
    types = types.push(type);
  }
  onChange('eventTypes', types);
}

EventTypesSwitcher.propTypes = {
  form: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  types: PropTypes.object.isRequired,
  formGroupStyles: PropTypes.string
};

export default EventTypesSwitcher;
