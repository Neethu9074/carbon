/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview.mless';

export function AlertPreview({ form, renderHeadline, getDescriptionPlaceholder, entityLabel, entityIconType }) {
  const description = form.get('description').value;
  const severity = Number(form.get('severity').value);
  const triggering = form.get('triggering').value;

  return (
    <div
      className={classNames({
        [locals.alertPreview]: true,
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
        type={getIconType(severity, triggering)}
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
        </p>
        <p>{description || getDescriptionPlaceholder(form)}</p>
      </div>
    </div>
  );
}

function getIconType(severity, triggering) {
  if (triggering) {
    return 'lib_events_incident';
  }
  return severity <= 5 ? 'lib_events_warning' : 'lib_events_critical';
}

export function AlertPreviewHeadline({ title }) {
  return <h3 className={locals.alertPreviewHeadline}>{title}</h3>;
}

AlertPreview.propTypes = {
  form: PropTypes.object.isRequired,
  renderHeadline: PropTypes.func.isRequired,
  getDescriptionPlaceholder: PropTypes.func.isRequired,
  entityIconType: PropTypes.string.isRequired,
  entityLabel: PropTypes.string
};
