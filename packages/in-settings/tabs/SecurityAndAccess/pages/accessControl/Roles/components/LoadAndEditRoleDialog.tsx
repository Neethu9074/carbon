/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import EditRoleDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog';
import LoadingDialog from 'in-settings/tabs/SecurityAndAccess/components/LoadingDialog/LoadingDialog';
import { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { getRole } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { pendingResult } from 'in-services/fixedObjects';

interface LoadAndEditRoleDialogProps extends Pick<Parameters<typeof getRole>[0], 'id'> {}

export default function LoadAndEditRoleDialog({ id }: LoadAndEditRoleDialogProps) {
  const roleResult = useObservable(() => getRole({ id }), [id]) ?? pendingResult;

  if (roleResult.progress.loading) return <LoadingDialog numberSkeletons={25} />;

  return <EditRoleDialog mode={FORM_MODE.EDIT} formValues={roleResult.data} />;
}
