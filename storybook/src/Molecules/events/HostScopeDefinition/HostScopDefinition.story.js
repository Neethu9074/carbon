/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { just } from '@instana/observables';

import HostScopeDefinitionSelector from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/HostScopeDefinitionSelector';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';

export default {
  title: 'Molecules|alerts/HostScopeDefinition'
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

  const [tagValue, setTagValue] = useState('');
  const [operator, setOperator] = useState(EQUALS);

  return (
    <HostScopeDefinitionSelector
      tagTreeNode={tagTreeNode}
      getSuggestions={() => getSuggestions()}
      tagValue={tagValue}
      setTagValue={setTagValue}
      operator={operator}
      setOperator={setOperator}
      handleCancel={() => setTagValue('')}
    />
  );
};
