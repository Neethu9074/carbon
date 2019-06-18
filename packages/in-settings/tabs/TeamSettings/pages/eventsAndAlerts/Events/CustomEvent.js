import React from 'react';

import {
  createCustomSytemRuleBasedEventSpecification,
  createCustomThresholdBasedEventSpecification,
  getCustomEventSpecification,
  saveCustomEventSpecification
} from 'in-api/eventSpecifications';
import {
  dataSourceSystem,
  createEventFormDefinition
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { unmapConditionValue } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import CustomEventForm from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventForm';
import { serializeQuery } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsAlertingEvents } from 'in-settings/navigation/paths';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import theme from 'in-themes';

export default function CustomEvent(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Event"
      entityId={entityId}
      createDefaultEntity={createCustomThresholdBasedEventSpecification}
      createForm={event => createEventFormDefinition(event, !entityId)}
      getEntityFromApi={getCustomEventSpecification}
      openEntities={() => goToPath(teamSettingsAlertingEvents)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { entity, form, message, error, loading, isCreate, saveEnabled } = props;

  if (!entity || !form) {
    return <LoadingIndicator type="dark" />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          Unknown Event
        </SubViewHeader>
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          If you followed a link to get here, it has most likely been deleted.
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

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

      <CustomEventForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        saveEnabled={saveEnabled}
        isCreate={isCreate}
        listPath={teamSettingsAlertingEvents}
      />
    </SettingsDetailPage>
  );
});

function save(event, form) {
  const ruleType = form.get('dataSource') && form.get('dataSource').value === dataSourceSystem ? 'system' : 'threshold';
  const query = serializeQuery(form);

  if (ruleType === 'system') {
    return saveCustomEventSpecification(
      createCustomSytemRuleBasedEventSpecification(
        event ? event.get('id') : null,
        form.get('name').value,
        // For now, all system rule based events use 'any' as their entity type. It does not make any sense to have this
        // attribute at all but the back end validation requires a value.
        'any',
        query,
        form.get('triggering').value,
        form.get('description').value,
        form.get('gracePeriod').value,
        event ? event.get('enabled') : true,
        ruleType,
        form.get('severity') ? Number(form.get('severity').value) : 0,
        form.get('systemRule') ? form.get('systemRule').value : null
      )
    );
  } else {
    const formatterType = form.get('formatter') ? form.get('formatter').value : null;
    let conditionValue = Number(form.get('conditionValue').value);
    conditionValue = unmapConditionValue(conditionValue, formatterType);

    return saveCustomEventSpecification(
      createCustomThresholdBasedEventSpecification(
        event ? event.get('id') : null,
        form.get('name').value,
        form.get('entityType') ? form.get('entityType').value : null,
        query,
        form.get('triggering').value,
        form.get('description').value,
        form.get('gracePeriod').value,
        event ? event.get('enabled') : true,
        ruleType,
        form.get('metricName') ? form.get('metricName').value : null,
        form.get('rollup') ? Number(form.get('rollup').value) : null,
        form.get('window') ? Number(form.get('window').value) : null,
        form.get('aggregation') ? form.get('aggregation').value : null,
        form.get('conditionOperator') ? form.get('conditionOperator').value : null,
        conditionValue,
        form.get('severity') ? Number(form.get('severity').value) : 0
      )
    );
  }
}
