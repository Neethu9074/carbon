/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertDescriptionRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertDescriptionRow';
import TriggersIncidentRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/TriggersIncidentRow';
import AlertLevelRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertLevelRow';
import Sections from 'in-components/workspace/Sections';

export default function AlertProperties({
  form,
  getDescriptionPlaceholder,
  onChange,
  trackTriggerChanged,
  renderAlertPropertiesTitleRow
}) {
  return (
    <Sections>
      {renderAlertPropertiesTitleRow()}
      <AlertLevelRow onChange={onChange} form={form} />
      <TriggersIncidentRow form={form} onChange={onChange} trackTriggerChanged={trackTriggerChanged} />
      <AlertDescriptionRow form={form} getDescriptionPlaceholder={getDescriptionPlaceholder} onChange={onChange} />
    </Sections>
  );
}

AlertProperties.propTypes = {
  form: PropTypes.object.isRequired,
  getDescriptionPlaceholder: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  trackTriggerChanged: PropTypes.func,
  /**
   * The title row has different capabilities in teh different areas
   */
  renderAlertPropertiesTitleRow: PropTypes.func.isRequired
};
