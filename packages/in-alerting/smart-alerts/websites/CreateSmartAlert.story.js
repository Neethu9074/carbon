/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CreateSmartAlert from 'in-alerting/smart-alerts/websites/CreateSmartAlert';
import history from 'in-stores/navigation/history';

export default {
  component: CreateSmartAlert
};

const locationWithmatrix = history.location;
locationWithmatrix.matrix = {};

export const Default = () => <CreateSmartAlert location={locationWithmatrix} websiteId={'someId'} />;
