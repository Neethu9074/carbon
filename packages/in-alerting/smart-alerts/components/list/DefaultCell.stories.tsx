/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';

export default { component: DefaultCell };

export const WithTitle = { args: { title: 'Some sample title' } };

export const WithSubTitle = {
  args: {
    title: 'Some sample title',
    subtitle: 'This is Subtitle'
  }
};
