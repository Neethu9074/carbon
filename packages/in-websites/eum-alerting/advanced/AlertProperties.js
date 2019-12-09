import PropTypes from 'prop-types';
import React from 'react';

import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-websites/eum-alerting/AlertConfigDialog';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import evaluateClassNames from 'in-services/util/classnames';
import ComboBox from 'in-components/ComboBox/ComboBox';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import TextArea from 'in-components/form/TextArea';

import locals from './AlertProperties.mless';

export default function AlertProperties({ form, onChange, websiteLabel }) {
  const severity = +form.get(fieldNames.severity).value;

  return (
    <div className={locals.container}>
      <div className={locals.alertPropsContainer}>
        <h3 className={locals.headline}>Alert Properties</h3>
        <div className={locals.alertProps}>
          <PropContainer
            left={'Title'}
            right={
              <TextArea
                className={locals.textArea}
                name={fieldNames.name}
                rows="3"
                value={form.get(fieldNames.name).value}
                onChange={e => onChange(form, fieldNames.name, (e && e.target.value) || '')}
                hasError={hasError(form.get(fieldNames.name))}
                maxLength={500}
                placeholder={getTitlePlaceholder(form)}
              />
            }
          />
          <PropContainer
            icon={severity <= 5 ? 'lib_events_warning' : 'lib_events_critical'}
            left={'Alert Level'}
            right={
              <ComboBox
                className={locals.alertLevel}
                name={fieldNames.severity}
                value={form.get(fieldNames.severity).value}
                options={selectOptions[fieldNames.severity]}
                onChange={e => onChange(form, fieldNames.severity, (e && e.value) || '')}
                defaultValue={selectOptions[fieldNames.severity][0].value}
                clearable={false}
              />
            }
          />
          <PropContainer
            icon={'lib_help_error_error_outline'}
            left={'Description'}
            right={
              <TextArea
                className={locals.textArea}
                name={fieldNames.description}
                rows="3"
                value={form.get(fieldNames.description).value}
                onChange={e => onChange(form, fieldNames.description, (e && e.target.value) || '')}
                hasError={hasError(form.get(fieldNames.description))}
                maxLength={500}
                placeholder={getDescriptionPlaceholder(form)}
              />
            }
          />
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

AlertProperties.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

function PropContainer({ left, right, icon }) {
  return (
    <div className={locals.propContainer}>
      <div className={locals.leftContent}>
        <div className={locals.iconWrapper}>{icon && <SvgIcon className={locals.icon} type={icon} />}</div>
        <div>{left}</div>
      </div>
      <div className={locals.rightContent}>{right}</div>
    </div>
  );
}

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

function hasError(field) {
  return !field.valid && field.touched;
}
