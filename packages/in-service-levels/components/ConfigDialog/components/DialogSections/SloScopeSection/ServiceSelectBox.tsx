/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LazyComboBoxInSection from 'in-components/form/ComboBoxInSection/ComboBoxInSection';
import getServices from 'in-applications/subscriptions/getServices';
import { ApplicationBoundaryScope, Nullish } from 'in-types';
import { titleWidth } from 'in-service-levels/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
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
  const timeConfig = useTimeConfig();
  return (
    <LazyComboBoxInSection
      loader={(query, page) =>
        getServices({
          filter: {
            timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false,
            application: applicationId,
            applicationBoundaryScope: boundaryScope,
            label: query
          },
          metrics: {},
          order: {
            by: 'serviceLabel',
            direction: 'ASC'
          },
          pagination: {
            page,
            pageSize: 100
          },
          contextScope: 'NONE'
        })
      }
      mapper={({ service }) => ({ label: service.label, value: service.id })}
      options={[{ label: t('in-custom-dashboards:widgets.slo.servicesSelectBox.allServices'), value: '' }]}
      id="new-sli-service-selection"
      titleWidth={width ?? titleWidth}
      label={t('in-custom-dashboards:widgets.slo.servicesSelectBox.service')}
      isDisabled={isBlank(applicationId) || disabled}
      onChange={target => onChange(target?.value)}
      hasError={hasError}
      value={value ?? ''}
    />
  );
}
