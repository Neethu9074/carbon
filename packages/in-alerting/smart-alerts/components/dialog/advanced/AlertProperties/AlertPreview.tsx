/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ReactNode } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { HighlightedPlaceholders } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview.mless';

interface AlertPreviewProps {
  form: MapForm<any>;
  renderHeadline: () => ReactNode;
  getDescriptionPlaceholder: (form: MapForm<any>, severity?: number) => string;
  entityLabel?: string;
  entityIconType: string;
  entityLabel2?: string;
  entityIconType2?: string;
  isTearSheet?: boolean;
  isMultiThreshold?: boolean;
  severity?: number;
  descriptionPlaceholder?: string;
}

export function AlertPreview({
  form,
  renderHeadline,
  getDescriptionPlaceholder,
  entityLabel,
  entityIconType,
  entityLabel2,
  entityIconType2,
  isTearSheet = false,
  isMultiThreshold = false,
  severity = Number(form.get('severity')?.value),
  descriptionPlaceholder
}: AlertPreviewProps) {
  const description = form.get('description')?.value;
  const triggering = form.get('triggering')?.value;

  return (
    <div
      className={classNames({
        [locals.alertPreview]: true,
        [locals.alertPreviewTearSheeet]: isTearSheet,
        [locals.multiThresholdAlertPreview]: isMultiThreshold,
        [locals.severityLow]: severity <= 5,
        [locals.severityHigh]: severity > 5
      })}
    >
      <SvgIcon
        className={classNames({
          [locals.alertLevelIcon]: true,
          [locals.severityLow]: severity <= 5,
          [locals.severityHigh]: severity > 5
        })}
        type={getIconType(severity!, triggering)}
      />
      <div className={locals.alertPreviewContent}>
        {renderHeadline()}
        <p className={locals.siteAndPageNames}>
          {entityLabel && (
            <span
              className={classNames({
                [locals.centered]: true,
                [locals.space]: true
              })}
            >
              <SvgIcon className={locals.filterIcon} size="s" type={entityIconType} />
              {entityLabel}
            </span>
          )}
          {entityLabel2 && (
            <span
              className={classNames({
                [locals.centered]: true,
                [locals.space]: true
              })}
            >
              <SvgIcon className={locals.filterIcon} size="s" type="lib_arrow_expand_right" />
              {entityIconType2 && <SvgIcon className={locals.filterIcon} size="s" type={entityIconType2} />}
              {entityLabel2}
            </span>
          )}
        </p>
        <p>
          {description ||
            (isMultiThreshold
              ? descriptionPlaceholder ?? getDescriptionPlaceholder(form, severity)
              : getDescriptionPlaceholder(form))}
        </p>
      </div>
    </div>
  );
}

function getIconType(severity: number, triggering: false): string {
  if (triggering) {
    return 'lib_events_incident';
  }
  return severity <= 5 ? 'lib_events_warning' : 'lib_events_critical';
}

export function AlertPreviewHeadline({ title }: { title: string | HighlightedPlaceholders }): JSX.Element {
  return <h3 className={locals.alertPreviewHeadline}>{title}</h3>;
}
