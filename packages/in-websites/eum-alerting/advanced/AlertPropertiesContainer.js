import PropTypes from 'prop-types';
import React from 'react';

import { getTitlePlaceholder, getDescriptionPlaceholder } from 'in-websites/eum-alerting/formHelpers';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import AlertProperties from 'in-websites/eum-alerting/advanced/AlertProperties';
import evaluateClassNames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './AlertProperties.mless';

export default function AlertPropertiesContainer({ form, onChange, websiteLabel, isReadOnly }) {
  const severity = +form.get(fieldNames.severity).value;

  return (
    <div className={locals.container}>
      <div className={locals.alertPropsContainer}>
        <h3 className={locals.headline}>Alert Properties</h3>
        <div className={locals.alertProps}>
          <AlertProperties form={form} onChange={onChange} isReadOnly={isReadOnly} websiteLabel={websiteLabel} />
        </div>
      </div>
      <div className={locals.previewArea}>
        <AlertPreview
          form={form}
          websiteLabel={websiteLabel}
          tagFilters={form.get(fieldNames.tagFilters).value}
          severity={severity}
        />
      </div>
    </div>
  );
}

AlertPropertiesContainer.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool
};

function AlertPreview({ form, websiteLabel, severity, tagFilters }) {
  const pages = tagFilters.filter(filter => filter.name === 'beacon.page.name');
  const name = form.get(fieldNames.name).value;
  const description = form.get(fieldNames.description).value;
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
          {websiteLabel && (
            <span
              className={evaluateClassNames({
                [locals.centred]: true,
                [locals.space]: pages.length === 0,
                [locals.divider]: pages.length > 0
              })}
            >
              <SvgIcon className={locals.filterIcon} size="s" type="lib_website" />
              {websiteLabel}
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
