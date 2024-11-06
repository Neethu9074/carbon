/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';
import { render } from '@testing-library/react';
import EntityHealthIcon from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/EntityHealthIcon';
import { useObservable } from '@instana/hooks';
import {healthColors} from 'in-stores/events'
const getMockSeverityInfo = (maxSeverity: number) => (new Map(Object.entries({maxSeverity, numberOfOpenEvent: maxSeverity ? 1 : 0,"eventWithMaxSeverity":null,"eventIds":[]})))

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('EntityHealthIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when no snapshot is available', () => {
    (useObservable as jest.Mock).mockImplementation(() => null);

    const snapshotId = '12345';
    const { container } = render(<EntityHealthIcon snapshotId={snapshotId} />);

    expect(container.firstChild).toBeNull();
  });

  it('should display the correct icon and tooltip when there are no issues', () => {
    const severity = 5;
    const expectedColor = Object.values(healthColors)[severity];

    (useObservable as jest.Mock).mockImplementation(() => getMockSeverityInfo(severity));

    const snapshotId = '12345';
    const { container } = render(<EntityHealthIcon snapshotId={snapshotId} />);

    const iconSvg = container.querySelector('svg');

    expect(iconSvg).toHaveStyle({ 'fill': expectedColor});
  });
});
