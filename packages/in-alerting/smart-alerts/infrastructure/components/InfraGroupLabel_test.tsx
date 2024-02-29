/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { TagCatalog } from '@instana/types';

import { GroupLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraGroupLabel';

describe('in-alerting/smart-alerts/infrastructure/components/InfraGroupLabel.tsx', () => {
  const tagCatalog = {
    tagTree: [
      {
        label: 'Others',
        children: [
          {
            label: 'label',
            description: 'Label/name of entity',
            tagName: 'label',
            type: 'TAG'
          }
        ],
        type: 'LEVEL',
        queryable: false
      }
    ],
    tags: [
      {
        name: 'label',
        type: 'STRING',
        label: 'label',
        description: '',
        idTag: false,
        canApplyToSource: false,
        canApplyToDestination: false
      }
    ],
    tagsByName: [],
    allTagNames: []
  } as TagCatalog;

  test('renders correctly when the group key is valid', () => {
    const groupKey = 'label';

    render(<GroupLabel groupKey={groupKey} tagCatalog={tagCatalog} />);

    expect(screen.getByText('label')).toBeInTheDocument();
  });
});
