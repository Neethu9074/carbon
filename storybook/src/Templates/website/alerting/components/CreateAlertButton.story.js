/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import CreateAlert from 'in-alerting/smart-alerts/websites/CreateAlert';

export default {
  title: 'Templates|website/alerting/components/CreateAlertButton',
  parameters: {
    // TODO remove after fixing broken story
    chromatic: { disable: true }
  },
  component: CreateAlert
};

export const CreateAlertButton = () => <CreateAlert />;
