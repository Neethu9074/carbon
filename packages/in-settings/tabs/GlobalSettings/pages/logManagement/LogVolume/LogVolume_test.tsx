/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render } from '@testing-library/react';
import React from 'react';

import LogVolumeDetails from 'in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/LogVolumeDetails';
import { LogVolumeUsageItem } from 'in-logging/api/logVolume';
import { finishedProgress } from 'in-services/fixedObjects';

const mockDataGiB: LogVolumeUsageItem[] = [
  {
    numberOfMonth: 3,
    logVolume: 3221225472,
    retentionPeriods: [
      {
        retentionDays: 90,
        logVolume: 1073741824
      },
      {
        retentionDays: 60,
        logVolume: 1073741824
      },
      {
        retentionDays: 30,
        logVolume: 1073741824
      }
    ]
  }
];

const mockDataTiB: LogVolumeUsageItem[] = [
  {
    numberOfMonth: 3,
    logVolume: 9895604649984,
    retentionPeriods: [
      {
        retentionDays: 90,
        logVolume: 3298534883328
      },
      {
        retentionDays: 60,
        logVolume: 3298534883328
      },
      {
        retentionDays: 30,
        logVolume: 3298534883328
      }
    ]
  }
];

describe('LogVolume component', () => {
  it('bytes are correctly converted to GiB', () => {
    const { getAllByText } = render(
      <LogVolumeDetails data={mockDataGiB} progress={finishedProgress} groupingTag={''} timePeriod={1} />
    );
    expect(getAllByText(/1\s*GiB/)).toHaveLength(3);
  });

  it('bytes are correctly converted to TiB', () => {
    const { getAllByText } = render(
      <LogVolumeDetails data={mockDataTiB} progress={finishedProgress} groupingTag={''} timePeriod={1} />
    );
    expect(getAllByText(/3\s*TiB/)).toHaveLength(3);
  });
});
