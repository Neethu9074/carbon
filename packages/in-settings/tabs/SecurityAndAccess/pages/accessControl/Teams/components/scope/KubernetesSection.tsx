/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { AccessRestriction, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  ScopeTableFormFieldType,
  SCOPE_FORM_ID,
  ScopeFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import LimitedAccessSwitcher, {
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import SelectEntitiesTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable';
import { getInitialScopeType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';

interface KubernetesSectionProps<I> {
  clustersFieldName: ScopeTableFormFieldType;
  clustersObservable: () => Observable<Result<I[]>>;
  clustersTableAddLabel: string;
  clustersTableTitle: string;
  extractId: (entity: I) => string;
  extractName: (entity: I) => string;
  limitedAccessScopes: AccessRestriction[];
  limitedAccessSwitchLabel: string;
  nameSpacesFieldName: ScopeTableFormFieldType;
  nameSpacesObservable: () => Observable<Result<I[]>>;
  nameSpacesTableAddLabel: string;
  nameSpacesTableTitle: string;
}

const KubernetesSection = <I,>({
  clustersFieldName,
  clustersObservable,
  clustersTableAddLabel,
  clustersTableTitle,
  extractId,
  extractName,
  limitedAccessSwitchLabel,
  limitedAccessScopes,
  nameSpacesFieldName,
  nameSpacesObservable,
  nameSpacesTableAddLabel,
  nameSpacesTableTitle
}: KubernetesSectionProps<I>) => {
  const { form } = useMapFormContext<ScopeFormFields>(SCOPE_FORM_ID);
  const permissionsField = form.getIn(['accessPermissions']);
  const [scopeType, setScopeType] = useState<string>(getInitialScopeType(permissionsField, limitedAccessScopes));

  return (
    <>
      <LimitedAccessSwitcher
        limitedAccessScopes={limitedAccessScopes}
        limitedAccessSwitchLabel={limitedAccessSwitchLabel}
        onChange={newScopeType => setScopeType(newScopeType)}
        onEntireUnitSelected={() =>
          // Reset selected clusters and namespaces
          form
            .updateIn(['kubernetesClusters'], f => f.setValue(undefined).setTouched(true))
            .updateIn(['kubernetesNamespaces'], f => f.setValue(undefined).setTouched(true))
        }
      />

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <>
          <SelectEntitiesTable
            extractId={extractId}
            extractName={extractName}
            fieldName={nameSpacesFieldName}
            observable={nameSpacesObservable}
            tableAddLabel={nameSpacesTableAddLabel}
            tableTitle={nameSpacesTableTitle}
            showTableHeader
          />

          <SelectEntitiesTable
            extractId={extractId}
            extractName={extractName}
            fieldName={clustersFieldName}
            observable={clustersObservable}
            tableAddLabel={clustersTableAddLabel}
            tableTitle={clustersTableTitle}
            showTableHeader
          />
        </>
      )}
    </>
  );
};

export default KubernetesSection;
