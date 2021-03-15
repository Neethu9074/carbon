/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CustomServiceMappingDialog from 'in-applications/Forms/CustomServiceMapping/CustomServiceMappingDialog';
import ServiceConfigSwitcher from 'in-applications/Forms/ServiceConfigSwitcher';
import MultiConfigView from 'in-applications/Forms/components/MultiConfigView';

export default function CustomServiceMapping(props) {
  return (
    <MultiConfigView viewSwitcher={<ServiceConfigSwitcher />} configView={<CustomServiceMappingDialog {...props} />} />
  );
}
