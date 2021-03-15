/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SyntheticCallConfigView from 'in-applications/Forms/SyntheticCallConfig/SyntheticCallConfigView';
import ServiceConfigSwitcher from 'in-applications/Forms/ServiceConfigSwitcher';
import MultiConfigView from 'in-applications/Forms/components/MultiConfigView';

export default function SyntheticCallConfig(props) {
  return (
    <MultiConfigView viewSwitcher={<ServiceConfigSwitcher />} configView={<SyntheticCallConfigView {...props} />} />
  );
}
