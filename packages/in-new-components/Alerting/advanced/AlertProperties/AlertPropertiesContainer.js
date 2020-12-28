import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AlertProperties from 'in-new-components/Alerting/advanced/AlertProperties/AlertProperties';
import TwoColumnContainer from 'in-new-components/Alerting/components/TwoColumnContainer';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './AlertPropertiesContainer.mless';

export default function AlertPropertiesContainer(props) {
  const { form } = props;
  const severity = Number(form.get('severity').value);

  return (
    <TwoColumnContainer
      mainContentHeadline="Alert Properties"
      mainContent={<AlertProperties {...props} />}
      secondaryContent={<AlertPreview {...props} tagFilters={form.get('tagFilters').value} severity={severity} />}
    />
  );
}

AlertPropertiesContainer.propTypes = {
  form: PropTypes.object.isRequired
};

function AlertPreview({ form, label, severity, getTitlePlaceholder, getDescriptionPlaceholder }) {
  const tagFilters = form.get('tagFilters').value;
  const pages = tagFilters.filter(filter => filter.name === 'beacon.page.name');
  const name = form.get('name').value;
  const description = form.get('description').value;

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
                [locals.centred]: true,
                [locals.space]: pages.length === 0,
                [locals.divider]: pages.length > 0
              })}
            >
              <SvgIcon className={locals.filterIcon} size="s" type="lib_website" />
              {label}
            </span>
          )}
          {pages &&
            pages.map((page, i) => (
              <span key={i} className={locals.centred}>
                <SvgIcon className={locals.filterIcon} size="s" type="lib_website_page_load" />
                {page.stringValue}
              </span>
            ))}
        </p>
        <p>{description || getDescriptionPlaceholder(form)}</p>
      </div>
    </div>
  );
}
