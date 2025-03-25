/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RecurrentMaintenanceWindowStatusCell } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/RecurrentMaintenanceWindowsList';

const states = [
  'UNSCHEDULED',
  'SCHEDULED',
  'ACTIVE',
  'FINISHED',
  'PAUSED',
  //V2 replaces Paused with Expired:
  'EXPIRED'
];

export default {
  component: RecurrentMaintenanceWindowStatusCell
};

export const Default = {
  argTypes: {
    state: {
      control: 'select',
      options: states
    }
  },
  args: {
    state: 'ACTIVE'
  }
};

export const AllVariants = args => (
  <table>
    <thead align="center">
      <th>
        <strong>Carbonized</strong>
      </th>
    </thead>
    <tbody>
      {states.map(state => (
        <tr key={state}>
          <td align="center">
            <RecurrentMaintenanceWindowStatusCell state={state} {...args} carbonized />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
