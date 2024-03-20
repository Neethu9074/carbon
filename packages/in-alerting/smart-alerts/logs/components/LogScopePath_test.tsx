/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import LogScopePath from 'in-alerting/smart-alerts/logs/components/LogScopePath';
import { t } from 'in-i18n';

const entityLabel = t('in-events:logSmartAlerts.logs');

describe('in-alerting/smart-alerts/logs/components/LogScopePath', () => {
  test('renders correctly with default props', () => {
    const { getByText } = render(<LogScopePath entityLabel={entityLabel} />);
    const entityLabelElement = getByText(entityLabel);
    expect(entityLabelElement).toBeInTheDocument();
  });

  test('renders correctly with provided props', () => {
    const { getByText } = render(<LogScopePath entityLabel={entityLabel} iconSize="l" noBottomMargin />);
    const entityLabelElement = getByText(entityLabel);
    expect(entityLabelElement).toBeInTheDocument();
  });
});
