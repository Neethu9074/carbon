/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';

describe('Render InfraScopePath : in-alerting/smart-alerts/infrastructure/components/InfraScopePath', () => {
  it('Check if component rendered in UI', () => {
    render(<InfraScopePath iconName="lib_infra_instanaAgent" infraName="Instana Agent" />);
    expect(screen.getAllByText('Instana Agent')).toHaveLength(1);
  });
});
