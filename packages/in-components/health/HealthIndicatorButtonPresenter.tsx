/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { MutableRefObject, RefCallback } from 'react';

import { Observable } from '@instana/observables';
import { Button } from '@instana/legacy';

import { getButtonKindBySeverity } from 'in-stores/events';
import { t } from 'in-i18n';

export interface HealthIndicatorButtonPresenterProps {
  openIssues?: number;
  openIncidents?: number;
  maxSeverity: number;
  onClick?: () => void;
  href$?: Observable<string>;
  refSetter?:
    | MutableRefObject<HTMLButtonElement | HTMLAnchorElement>
    | RefCallback<HTMLButtonElement | HTMLAnchorElement>;
  showCheckAsNeutral?: boolean;
}

export default function HealthIndicatorButtonPresenter({
  openIssues,
  openIncidents,
  maxSeverity,
  onClick,
  href$,
  refSetter,
  showCheckAsNeutral = false
}: HealthIndicatorButtonPresenterProps) {
  const isWithoutIssues = maxSeverity === 0 && showCheckAsNeutral;
  const kind = isWithoutIssues ? 'create' : getButtonKindBySeverity(maxSeverity);
  const icon = isWithoutIssues ? 'lib_check' : 'lib_help_error_warning';

  return (
    <Button kind={kind} icon={icon} onClick={onClick} href$={href$} refSetter={refSetter} disabled={!onClick && !href$}>
      {getLabel(openIssues, openIncidents)}
    </Button>
  );
}

function getLabel(openIssues?: number, openIncidents?: number): string {
  if (openIssues != null) {
    return getIssueLabel(openIssues);
  }
  if (openIncidents != null) {
    return getIncidentLabel(openIncidents);
  }
  // Neither assume issues nor incidents while this information is not (yet) present, in case of e.g. lazy loading.
  return '';
}

function getIssueLabel(count: number): string {
  if (count === 0) {
    return t('in-components:health.noIssues');
  }

  return t('in-components:health.openIssues', {
    count
  });
}

function getIncidentLabel(count: number): string {
  if (count === 0) {
    return t('in-components:health.noIncidents');
  }

  return t('in-components:health.openIncidents', {
    count
  });
}
