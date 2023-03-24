/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn/CenterAlignmentColumn';

export default function NotFound() {
  return (
    <Li>
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          icon="lib_missing_data"
          title="No jobs available"
          explanation={() => 'No jobs available'}
          changeExplanation={() => 'There were no jobs retrieved for the selected time range.'}
        />
      </CenterAlignmentColumn>
    </Li>
  );
}
