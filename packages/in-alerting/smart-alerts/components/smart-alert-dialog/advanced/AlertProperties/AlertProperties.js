/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertDescriptionRow from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertDescriptionRow';
import TriggersIncidentRow from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/TriggersIncidentRow';
import AlertLevelRow from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertLevelRow';
import Sections from 'in-components/workspace/Sections';

export default function AlertProperties({
  form,
  getDescriptionPlaceholder,
  onChange,
  trackAlertLevelChanged,
  trackDescriptionChanged,
  trackTriggerChanged,
  renderAlertPopertiesTitleRow
}) {
  return (
    <Sections>
      {renderAlertPopertiesTitleRow()}
      <AlertLevelRow onChange={onChange} trackAlertLevelChanged={trackAlertLevelChanged} form={form} />
      <TriggersIncidentRow form={form} onChange={onChange} trackTriggerChanged={trackTriggerChanged} />
      <AlertDescriptionRow
        form={form}
        getDescriptionPlaceholder={getDescriptionPlaceholder}
        onChange={onChange}
        trackDescriptionChanged={trackDescriptionChanged}
      />
    </Sections>
  );
}

AlertProperties.propTypes = {
  form: PropTypes.object.isRequired,
  getDescriptionPlaceholder: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  trackAlertLevelChanged: PropTypes.func,
  trackDescriptionChanged: PropTypes.func,
  trackTriggerChanged: PropTypes.func,
  /**
   * The title row has different capabilities in teh different areas
   */
  renderAlertPopertiesTitleRow: PropTypes.func.isRequired
};
