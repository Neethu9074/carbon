/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CreateSmartAlert from 'in-alerting/smart-alerts/websites/CreateSmartAlert';

export default {
  parameters: {
    // TODO remove after fixing broken story
    storyshots: { disable: true },
    chromatic: { disable: true }
  },
  component: CreateSmartAlert
};

export const CreateAlertButton = () => <CreateSmartAlert />;
