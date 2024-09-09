/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from '@instana/i18n-react';

import {
  isAvailabilitySliEntity,
  isWebsiteEventBasedSliEntity
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { minutes, number } from 'in-services/formatters/number';
import { SliEntity } from 'in-types';

type FormatterFunction = (value: number) => string;

export function useSliFormatter(sliEntity?: SliEntity): FormatterFunction {
  if (sliEntity && (isAvailabilitySliEntity(sliEntity) || isWebsiteEventBasedSliEntity(sliEntity))) {
    return callsFormatter;
  }
  return minutes.fixedCompact;
}

function callsFormatter(value: number): string {
  if (value >= 10000) {
    return t('in-custom-dashboards:widgets.slo.sliFormatter.thousandCallsFormat', {
      count: number.detailed(value / 1000)
    });
  }

  return `${number.compact(value)} ${t('in-custom-dashboards:widgets.slo.sliFormatter.unit', { count: value })}`;
}
