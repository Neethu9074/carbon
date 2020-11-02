import PropTypes from 'prop-types';
import React from 'react';

import AlertProperties from 'in-new-components/Alerting/advanced/AlertProperties/AlertProperties';
import TwoColumnContainer from 'in-new-components/Alerting/components/TwoColumnContainer';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import evaluateClassNames from 'in-services/util/classnames';
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
  let tagFilters; //QB1
  let tagFilterExpression; //QB2

  switchQB1orQB2Helper(
    () => (tagFilters = form.get('tagFilters').value),
    () => (tagFilterExpression = form.get('tagFilterExpression').value)
  );

  const pages = (tagFilters ?? tagFilterExpression).filter(filter => filter.name === 'beacon.page.name');
  const name = form.get('name').value;
  const description = form.get('description').value;

  return (
    <div
      className={evaluateClassNames({
        [locals.alertPreview]: true,
        [locals.severityLow]: severity <= 5,
        [locals.severityHigh]: severity > 5
      })}
    >
      <SvgIcon
        className={evaluateClassNames({
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
              className={evaluateClassNames({
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
