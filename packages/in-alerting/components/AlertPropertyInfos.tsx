/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Spacer, Toggle } from '@instana/components';

import { HighlightedPlaceholders } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import AlertSection from 'in-alerting/components/AlertSection';
import { toHtml } from 'in-services/formatters/markdown';
import Sections from 'in-components/workspace/Sections';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/AlertPropertyInfos.mless';

interface PropertiesBySeverityProps {
  icon: string;
  label: string;
}

interface AlertConfigProps {
  name: string;
  description: string;
  triggering?: boolean;
  severity: number;
}

const propertiesBySeverity: Readonly<Record<number, PropertiesBySeverityProps>> = Object.freeze({
  5: {
    icon: 'lib_events_warning',
    label: t('in-alerting:components.alertPropertyInfosWarning')
  },
  10: {
    icon: 'lib_events_critical',
    label: t('in-alerting:components.alertPropertyInfosCritical')
  }
});

interface AlertPropertyInfosProps {
  alertConfig: AlertConfigProps;
  renderCustomTitle?: () => HighlightedPlaceholders;
  disableTrigger: boolean;
  shouldDisplayAlertLevelSection?: boolean;
}

export default function AlertPropertyInfos({
  alertConfig: { name, description, triggering = false, severity },
  renderCustomTitle,
  disableTrigger,
  shouldDisplayAlertLevelSection = true
}: AlertPropertyInfosProps) {
  const severityProperty = propertiesBySeverity[severity];

  return (
    <Sections>
      <AlertSection title={t('in-alerting:components.alertPropertyInfosLabelTitle')}>
        <Label className={locals.staticTitle}>{renderCustomTitle?.() ?? name}</Label>
      </AlertSection>
      {shouldDisplayAlertLevelSection && (
        <AlertSection
          icon={severityProperty.icon}
          title={t('in-alerting:components.alertPropertyInfosLabelAlertLevel')}
        >
          <Label className={locals.staticSeverity}>{severityProperty.label}</Label>
        </AlertSection>
      )}
      {!disableTrigger && (
        <AlertSection
          icon="lib_events_incident"
          title={t('in-alerting:components.alertPropertyInfosLabelTriggersIncident')}
        >
          <Toggle checked={triggering} disabled />
          <Spacer horizontal="xxsmall" />
        </AlertSection>
      )}
      <AlertSection
        icon="lib_help_error_error_outline"
        title={t('in-alerting:components.alertPropertyInfosLabelDescription')}
      >
        <Label className={locals.staticDescription}>
          <DangerousHtmlPresenter html={toHtml(description)} />
        </Label>
      </AlertSection>
    </Sections>
  );
}
