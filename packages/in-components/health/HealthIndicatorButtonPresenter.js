/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { getButtonKindBySeverity } from 'in-stores/events';
import { t } from 'in-i18n';

export default function HealthIndicatorButtonPresenter({
  // Note: only one of openIssues or openIncidents should be set. And zero issues is assumed if none is present.
  // In typescript, both properties would be optional.
  openIssues,
  openIncidents,
  maxSeverity,
  onClick,
  href$,
  refSetter,
  showCheckAsNeutral = false
}) {
  let kind;
  let icon;
  if (maxSeverity === 0 && showCheckAsNeutral) {
    kind = 'create';
    icon = 'lib_check';
  } else {
    kind = getButtonKindBySeverity(maxSeverity);
    icon = 'lib_help_error_warning';
  }

  return (
    <Button kind={kind} icon={icon} onClick={onClick} href$={href$} refSetter={refSetter} disabled={!onClick && !href$}>
      {getLabel(openIssues, openIncidents)}
    </Button>
  );
}

function getLabel(openIssues, openIncidents) {
  if (openIssues == null && openIncidents == null) {
    // Neither assume issues nor incidents while this information is not (yet) present, in case of e.g. lazy loading.
    return '';
  }

  return openIssues != null ? getIssueLabel(openIssues) : getIncidentLabel(openIncidents);
}

function getIssueLabel(count) {
  if (count === 0) {
    return t('in-components:health.noIssues');
  }

  return t('in-components:health.openIssues', {
    count
  });
}

function getIncidentLabel(count) {
  if (count === 0) {
    return t('in-components:health.noIncidents');
  }

  return t('in-components:health.openIncidents', {
    count
  });
}
