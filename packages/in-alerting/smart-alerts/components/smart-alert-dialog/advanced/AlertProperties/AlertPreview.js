/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer.mless';

export function AlertPreview({ form, label, entityIconType, getDescriptionPlaceholder, renderHeadline }) {
  const description = form.get('description').value;
  const severity = Number(form.get('severity').value);

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
        type={severity <= 5 ? 'lib_events_warning' : 'lib_events_critical'}
      />
      <div className={locals.alertPreviewContent}>
        {renderHeadline()}
        <p className={locals.siteAndPageNames}>
          {label && (
            <span
              className={classNames({
                [locals.centered]: true,
                [locals.space]: true
              })}
            >
              <SvgIcon className={locals.filterIcon} size="s" type={entityIconType} />
              {label}
            </span>
          )}
        </p>
        <p>{description || getDescriptionPlaceholder(form)}</p>
      </div>
    </div>
  );
}

export function AlertPreviewHeadline({ title }) {
  return <h3 className={locals.alertPreviewHeadline}>{title}</h3>;
}

AlertPreview.propTypes = {
  entityIconType: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  getDescriptionPlaceholder: PropTypes.func.isRequired,
  label: PropTypes.string,
  renderHeadline: PropTypes.func.isRequired
};
