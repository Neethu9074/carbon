/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import CustomServiceMappingDialog from 'in-applications/Forms/CustomServiceMapping/CustomServiceMappingDialog';
import CustomServiceMappingDialog from 'in-applications/Forms/CustomServiceMapping/CustomServiceMappingDialog';

export default {
  component: CustomServiceMappingDialog
};

export function Default() {
  return <CustomServiceMappingDialog />;
}
