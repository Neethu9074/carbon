/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { BlueprintDescription, BlueprintText } from 'in-alerting/smart-alerts/components/dialog/BlueprintDescription';

const config = {
  headline: 'headline',
  text: 'text'
};
const betaConfig = {
  isBeta: true,
  headline: 'headline',
  text: 'text'
};

export default {
  title: 'Blue print description'
};
export const Description = () => (
  <BlueprintDescription config={config} selectButtonDisabled={false} isSimpleMode={false} />
);

export const SimpleDescription = () => (
  <BlueprintDescription config={config} selectButtonDisabled={false} isSimpleMode />
);

export const Text = () => <BlueprintText config={config} />;

export const BetaDescription = () => (
  <BlueprintDescription config={betaConfig} selectButtonDisabled={false} isSimpleMode={false} />
);

export const SimpleBetaDescription = () => (
  <BlueprintDescription config={betaConfig} selectButtonDisabled={false} isSimpleMode />
);

export const BetaText = () => <BlueprintText config={betaConfig} />;
