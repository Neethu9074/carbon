/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React, { MutableRefObject, RefCallback } from 'react';
import classNames from 'classnames';

import { Button, ButtonSizes, Stack } from '@instana/components';
import { Observable } from '@instana/observables';

import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { getButtonKindBySeverity } from 'in-stores/events';
import { t } from 'in-i18n';

import locals from 'in-components/health/HealthIndicatorButtonPresenter.mless';

export interface CveIndicatorButtonPresenterProps {
  openIssues?: number;
  openIncidents?: number;
  maxSeverity: number;
  onClick?: () => void;
  href$?: Observable<string>;
  refSetter?:
    | MutableRefObject<HTMLButtonElement | HTMLAnchorElement>
    | RefCallback<HTMLButtonElement | HTMLAnchorElement>;
  showCheckAsNeutral?: boolean;
  isOpen?: boolean;
  size?: keyof typeof ButtonSizes;
}

export default function CveIndicatorButtonPresenter({
  openIssues,
  openIncidents,
  maxSeverity,
  onClick,
  href$,
  refSetter,
  showCheckAsNeutral = false,
  isOpen,
  size
}: CveIndicatorButtonPresenterProps) {
  const isWithoutIssues = maxSeverity === 0 && showCheckAsNeutral;
  const kind = isWithoutIssues ? 'create' : getButtonKindBySeverity(maxSeverity);
  const icon = isWithoutIssues ? 'lib_check' : 'lib_events_cve';
  const isWarning = kind === 'warning';
  const isDanger = kind === 'danger';
  const { trackVulnerabilityInContainerDashboard } = useVulnerabilityTracker();
  const handleClick = () => {
    trackVulnerabilityInContainerDashboard();
    if (onClick) {
      onClick();
    }
  };
  if (carbonButtonEnabled) {
    return (
      <Button
        kind="tertiary"
        onClick={handleClick}
        href$={href$}
        size={size ? size : 'compact'}
        refSetter={refSetter}
        className={classNames({
          [locals.noIssues]: isWithoutIssues,
          [locals.warning]: isWarning,
          [locals.danger]: isDanger
        })}
        icon={isWithoutIssues ? undefined : isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        disabled={!onClick && !href$}
      >
        <Stack direction="horizontal" gap="xsmall" align={isWarning ? undefined : 'center'}>
          <HealthIcon disabled={!onClick && !href$} severity={maxSeverity} iconSize="xs" />
          {getLabel(openIssues, openIncidents)}
        </Stack>
      </Button>
    );
  }
  return (
    <Button
      kind={kind}
      icon={icon}
      onClick={handleClick}
      href$={href$}
      refSetter={refSetter}
      disabled={!onClick && !href$}
    >
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
    return carbonButtonEnabled
      ? t('in-components:vulnerabilities.carbonNoVulnerabilities')
      : t('in-components:vulnerabilities.noVulnerabilities');
  }

  return carbonButtonEnabled
    ? t('in-components:vulnerabilities.carbonOpenVulnerabilities', {
        count
      })
    : t('in-components:vulnerabilities.openVulnerabilities', {
        count
      });
}

function getIncidentLabel(count: number): string {
  if (count === 0) {
    return carbonButtonEnabled
      ? t('in-components:vulnerabilities.carbonNoIncidents')
      : t('in-components:vulnerabilities.noIncidents');
  }

  return carbonButtonEnabled
    ? t('in-components:vulnerabilities.carbonOpenIncidents', {
        count
      })
    : t('in-components:vulnerabilities.openIncidents', {
        count
      });
}
