/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import useEndpoints from 'in-applications/hooks/useEndpoints';
import { ApplicationBoundaryScope, Nullish } from 'in-types';
import { titleWidth } from 'in-service-levels/constants';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface EndpointSelectBoxProps {
  applicationId: string;
  hasError?: boolean;
  serviceId?: string | Nullish;
  boundaryScope: ApplicationBoundaryScope;
  value: string | Nullish;
  onChange: (endpoint: string) => void;
  width?: string;
}

export default function EndpointSelectBox({
  applicationId,
  hasError,
  serviceId,
  boundaryScope,
  value,
  onChange,
  width
}: EndpointSelectBoxProps) {
  const [endpointsPage, status] = useEndpoints({
    application: applicationId,
    service: serviceId ?? undefined,
    filter: {
      applicationBoundaryScope: boundaryScope
    }
  });

  return (
    <SelectInSection
      id="new-sli-endpoint-selection"
      label={t('in-custom-dashboards:widgets.slo.endpointSelectBox.endpoint')}
      disabled={isBlank(applicationId) || status !== 'resolved'}
      value={value ?? ''}
      titleWidth={width ? width : titleWidth}
      onChange={({ target }) => onChange?.(target?.value)}
      hasError={hasError}
    >
      {status === 'pending' ? (
        <option value="">{t('in-custom-dashboards:widgets.slo.endpointSelectBox.loading')}</option>
      ) : (
        <option value="">{t('in-custom-dashboards:widgets.slo.endpointSelectBox.allEndpoints')}</option>
      )}
      {endpointsPage?.items.map(({ endpoint }) => (
        <option value={endpoint.id} key={endpoint.id}>
          {endpoint.label}
        </option>
      ))}
    </SelectInSection>
  );
}
