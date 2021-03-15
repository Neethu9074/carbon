/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import TwoColumnContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/TwoColumnContainer';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer.mless';

export default function AlertPropertiesContainer(props) {
  return (
    <TwoColumnContainer
      mainContentHeadline={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertProperties')}
      mainContent={<AlertProperties {...props} />}
      secondaryContent={<AlertPreview {...props} />}
    />
  );
}

AlertPropertiesContainer.propTypes = {
  form: PropTypes.object.isRequired
};

function AlertPreview({ form, label, entityIconType, getTitlePlaceholder, getDescriptionPlaceholder }) {
  const name = form.get('name').value;
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
        <h3 className={locals.alertPreviewHeadline}>{name || getTitlePlaceholder(form)}</h3>
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
