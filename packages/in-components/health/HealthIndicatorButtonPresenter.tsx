/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { MutableRefObject, RefCallback } from 'react';
import classNames from 'classnames';

import { Button, ButtonSizes, Stack } from '@instana/components';
import { Observable } from '@instana/observables';

import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { getButtonKindBySeverity } from 'in-stores/events';
import { t } from 'in-i18n';

import locals from 'in-components/health/HealthIndicatorButtonPresenter.mless';

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
  isOpen?: boolean;
  size?: keyof typeof ButtonSizes;
}

export default function HealthIndicatorButtonPresenter({
  openIssues,
  openIncidents,
  maxSeverity,
  onClick,
  href$,
  refSetter,
  showCheckAsNeutral = false,
  isOpen,
  size
}: HealthIndicatorButtonPresenterProps) {
  const isWithoutIssues = maxSeverity === 0 && showCheckAsNeutral;
  const kind = isWithoutIssues ? 'create' : getButtonKindBySeverity(maxSeverity);
  const icon = isWithoutIssues ? 'lib_check' : 'lib_help_error_warning';
  const isWarning = kind === 'warning';
  const isDanger = kind === 'danger';
  const iconButton = getLabel(openIssues, openIncidents) === '' ? true : false;
  if (carbonButtonEnabled) {
    return (
      <Button
        kind="tertiary"
        onClick={onClick}
        href$={href$}
        refSetter={refSetter}
        size={size ? size : 'compact'}
        className={classNames({
          [locals.noIssues]: isWithoutIssues,
          [locals.warning]: isWarning,
          [locals.danger]: isDanger,
          [locals.iconOnly]: iconButton
        })}
        hasIconOnly={iconButton}
        iconDescription={kind}
        disabled={!onClick && !href$}
        icon={isWithoutIssues || iconButton ? undefined : isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        aria-haspopup
        aria-expanded={isOpen}
      >
        <Stack direction="horizontal" gap="xsmall" align={isWarning ? undefined : 'center'}>
          <HealthIcon disabled={!onClick && !href$} severity={maxSeverity} iconSize="xs" />
          {getLabel(openIssues, openIncidents)}
        </Stack>
      </Button>
    );
  }

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
    return carbonButtonEnabled ? t('in-components:health.carbonNoIssues') : t('in-components:health.noIssues');
  }

  return carbonButtonEnabled
    ? t('in-components:health.carbonOpenIssues', {
        count
      })
    : t('in-components:health.openIssues', {
        count
      });
}

function getIncidentLabel(count: number): string {
  if (count === 0) {
    return carbonButtonEnabled ? t('in-components:health.carbonNoIncidents') : t('in-components:health.noIncidents');
  }

  return carbonButtonEnabled
    ? t('in-components:health.carbonOpenIncidents', {
        count
      })
    : t('in-components:health.openIncidents', {
        count
      });
}
