/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ConfigDialogTimeConfigContextModification from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ConfigDialogTimeConfigContextModification';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { ApplicationBoundaryScope, Nullish } from 'in-types';
import useServices from 'in-applications/hooks/useServices';
import { t } from 'in-i18n';

interface ServiceSelectBoxProps {
  hasError?: boolean;
  applicationId: string;
  boundaryScope: ApplicationBoundaryScope;
  value?: string | Nullish;
  onChange: (application?: string) => void;
}
const time = ConfigDialogTimeConfigContextModification();
export default function ServiceSelectBox({
  applicationId,
  hasError,
  boundaryScope,
  value,
  onChange
}: ServiceSelectBoxProps) {
  const [servicesPage, status] = useServices({
    application: applicationId,
    filter: {
      applicationBoundaryScope: boundaryScope
    },
    time
  });

  return (
    <SelectInSection
      id="new-sli-service-selection"
      label={t('in-custom-dashboards:widgets.slo.servicesSelectBox.service')}
      disabled={status !== 'resolved'}
      value={value ?? ''}
      onChange={({ target }) => onChange?.(target?.value)}
      hasError={hasError}
    >
      {status === 'pending' ? (
        <option value="">{t('in-custom-dashboards:widgets.slo.servicesSelectBox.loading')}</option>
      ) : (
        <option value="">{t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices')}</option>
      )}
      {servicesPage?.items?.map(({ service }) => (
        <option value={service.id} key={service.id}>
          {service.label}
        </option>
      ))}
    </SelectInSection>
  );
}
