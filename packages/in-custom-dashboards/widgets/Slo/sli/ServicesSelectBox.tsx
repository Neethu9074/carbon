/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import useServices from 'in-applications/hooks/useServices';
import { ApplicationBoundaryScope } from 'in-types';
import { t } from 'in-i18n';

interface ServicesSelectBoxProps {
  hasError?: boolean;
  applicationId: string;
  boundaryScope: ApplicationBoundaryScope;
  value?: string;
  onChange: (application?: string) => void;
}

export default function ServicesSelectBox({
  applicationId,
  hasError,
  boundaryScope,
  value,
  onChange
}: ServicesSelectBoxProps) {
  const [servicesPage, status] = useServices({
    application: applicationId,
    filter: {
      applicationBoundaryScope: boundaryScope
    }
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
