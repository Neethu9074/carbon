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
  boundaryScope: ApplicationBoundaryScope;
  disabled?: boolean;
  hasError?: boolean;
  onChange: (endpoint: string) => void;
  width?: string;
  serviceId?: string | Nullish;
  value: string | Nullish;
}

export default function EndpointSelectBox({
  applicationId,
  boundaryScope,
  disabled = false,
  hasError,
  onChange,
  serviceId,
  value,
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
    <div>
      <SelectInSection
        disabled={isBlank(applicationId) || status !== 'resolved' || disabled}
        hasError={hasError}
        id="new-sli-endpoint-selection"
        label={t('in-custom-dashboards:widgets.slo.endpointSelectBox.endpoint')}
        onChange={({ target }) => onChange?.(target?.value)}
        titleWidth={width ? width : titleWidth}
        value={value ?? ''}
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
    </div>
  );
}
