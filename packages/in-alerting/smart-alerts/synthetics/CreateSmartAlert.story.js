/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CreateSmartAlert from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import DialogPresenter from 'in-components/DialogPresenter';

export default {
  component: CreateSmartAlert
};
export const Default = () => (
  <>
    <CreateSmartAlert />
    <DialogPresenter />
  </>
);
