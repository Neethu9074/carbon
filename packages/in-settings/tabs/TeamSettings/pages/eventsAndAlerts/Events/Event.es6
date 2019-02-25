import { fromJS } from 'immutable';
import React from 'react';

import { unmapConditionValue } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/components/EventDetails';
import EventForm, { eventFormDefinition } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/EventForm';
import { events, teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getRule, saveRule, createRule } from 'in-api/rules';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import { eventType } from 'in-settings/navigation/matrix';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import { getBuiltInRule } from 'in-api/rules';
import entityForm from 'in-hoc/entityForm';

export default function Rule(props) {
  const entityId = props.match.params.id;
  const type = getMatrixParameter(props.location, events, eventType);

  // TODO Actually, we always need to load the custom event but for that we need an actual event ID
  return (
    <Form
      title="Event"
      entityId={entityId}
      createDefaultEntity={createRule}
      createForm={createForm}
      getEntityFromApi={type === 'built-in' ? getBuiltInRule : getRule}
      openEntities={() => goToPath(teamSettingsAlertingEvents)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, message, error, loading, isCreate } = props;
  return (
    <SettingsDetailPage>
      <SubViewHeader>{isCreate ? 'Create A New Event' : `Configure Event: ${entity.get('name')}`}</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <EventForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingEvents}
      />
    </SettingsDetailPage>
  );
});

function save(event, form) {
  const formatterType = form.get('formatter').value;

  let conditionValue = Number(form.get('conditionValue').value);
  conditionValue = unmapConditionValue(conditionValue, formatterType);

  // TODO We need to save an event, not a rule.
  return saveRule(
    fromJS(
      createRule(
        event ? event.get('id') : null,
        form.get('name').value,
        form.get('entityType').value,
        form.get('metricName').value,
        form.get('rollup') ? Number(form.get('rollup').value) : '',
        form.get('window') ? Number(form.get('window').value) : '',
        form.get('aggregation') ? form.get('aggregation').value : null,
        form.get('conditionOperator').value,
        conditionValue
      )
    )
  );
}

function createForm(rule) {
  return eventFormDefinition(rule);
}
