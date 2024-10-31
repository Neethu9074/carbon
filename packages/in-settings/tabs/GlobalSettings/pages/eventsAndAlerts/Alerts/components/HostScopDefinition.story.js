/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { just } from '@instana/observables';

import HostScopeDefinitionSelector from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/HostScopeDefinitionSelector';
import { putScopeByHostsFields } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';

export default {
  title: 'Host scope definition'
};

export const Default = () => {
  // in real example, it could be extracted from tagCatalog:
  // tagTreeNode={tagCatalog.tagsByName['other.tag']}
  const tagTreeNode = {
    label: 'tag',
    name: 'tag',
    path: [
      {
        label: 'Infrastructure',
        type: 'LEVEL'
      },
      {
        label: 'tag',
        type: 'TAG'
      }
    ],
    type: 'STRING'
  };

  // dummy, would normally be provided by
  // QueryBuilder, e.g.
  // in-infrastructure/Explore/components/QueryBuilder
  const getSuggestions = () =>
    just({
      data: {
        suggestions: [
          'agent_bosh_release_version=1.197.0',
          'bosh_deployment=cf-5466b622115ab0abe169',
          'tile_version=1.197.0',
          'bosh_availability_zone=europe-west4-a',
          'bosh_availability_zone=europe-west4-b',
          'bosh_availability_zone=europe-west4-c',
          'bosh_instance_group=loggregator_trafficcontroller',
          'bosh_instance_name=loggregator_trafficcontroller',
          'bosh_instance_group=diego_brain',
          'bosh_instance_group=diego_cell'
        ]
      }
    });

  const [form, updateForm] = useState(putScopeByHostsFields(createMapForm()));

  return (
    <HostScopeDefinitionSelector
      tagTreeNode={tagTreeNode}
      getSuggestions={() => getSuggestions()}
      tagValueField={form.get('tagValue')}
      setTagValue={updatedValue => updateForm(updateFormField(['tagValue'], updatedValue))}
      operator={form.get('tagOperator').value}
      setOperator={updatedOperator => updateForm(updateFormField(['tagOperator'], updatedOperator))}
      handleCancel={() => updateForm(updateFormField(['tagValue'], ''))}
    />
  );

  function updateFormField(fieldPath, value) {
    return form.updateIn(fieldPath, field => field.setValue(value).setTouched(true));
  }
};
