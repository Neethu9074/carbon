/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LazyComboBoxInSection from 'in-components/form/ComboBoxInSection/ComboBoxInSection';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { ApplicationBoundaryScope, Nullish } from 'in-types';
import { titleWidth } from 'in-service-levels/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface EndpointSelectBoxProps {
  applicationId: string;
  boundaryScope: ApplicationBoundaryScope;
  disabled?: boolean;
  hasError?: boolean;
  onChange: (endpoint?: string) => void;
  width?: string;
  serviceId?: string | Nullish;
  value?: string | Nullish;
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
  const timeConfig = useTimeConfig();

  return (
    <LazyComboBoxInSection
      loader={(query, page) =>
        getEndpoints({
          filter: {
            timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false,
            application: applicationId,
            service: serviceId ?? undefined,
            applicationBoundaryScope: boundaryScope,
            label: query
          },
          metrics: {},
          order: {
            by: 'endpointLabel',
            direction: 'ASC'
          },
          pagination: {
            page,
            pageSize: 100
          },
          supportedOrderByCriteria: false
        })
      }
      mapper={({ endpoint }) => ({ label: endpoint.label, value: endpoint.id })}
      options={[{ label: t('in-custom-dashboards:widgets.slo.endpointSelectBox.allEndpoints'), value: '' }]}
      id="new-sli-endpoint-selection"
      titleWidth={width ?? titleWidth}
      label={t('in-custom-dashboards:widgets.slo.endpointSelectBox.endpoint')}
      isDisabled={isBlank(applicationId) || disabled}
      onChange={target => onChange(target?.value)}
      hasError={hasError}
      value={value ?? ''}
    />
  );
}
