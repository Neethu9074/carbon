/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import { ApplicationBoundaryScope, Nullish } from 'in-types';
import useServices from 'in-applications/hooks/useServices';
import { titleWidth } from 'in-service-levels/constants';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface ServiceSelectBoxProps {
  applicationId: string;
  boundaryScope: ApplicationBoundaryScope;
  disabled?: boolean;
  hasError?: boolean;
  onChange: (application?: string) => void;
  value?: string | Nullish;
  width?: string;
}

export default function ServiceSelectBox({
  applicationId,
  boundaryScope,
  disabled = false,
  hasError,
  onChange,
  value,
  width
}: ServiceSelectBoxProps) {
  const [servicesPage, status] = useServices({
    application: applicationId,
    filter: {
      applicationBoundaryScope: boundaryScope
    }
  });

  return (
    <SelectInSection
      id="new-sli-service-selection"
      titleWidth={width ?? titleWidth}
      label={t('in-custom-dashboards:widgets.slo.servicesSelectBox.service')}
      disabled={isBlank(applicationId) || status !== 'resolved' || disabled}
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
