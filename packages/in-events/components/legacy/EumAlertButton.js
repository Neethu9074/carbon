import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';

import Button from 'in-new-components/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';

export default function EumAlertButton({ websiteLabel, tagFilters, timeConfigFromEvent, alertType }) {
  return alertType === alertTypes.specificJsError ? (
    <GoToAnalyzeButton
      websiteLabel={websiteLabel}
      tagFilters={tagFilters}
      timeConfigFromEvent={timeConfigFromEvent}
      icon={'lib_website_error'}
      group={defaultGroupings.error}
      beaconType={'error'}
      title={'Analyze JS Errors'}
    />
  ) : (
    <GoToAnalyzeButton
      websiteLabel={websiteLabel}
      tagFilters={tagFilters}
      timeConfigFromEvent={timeConfigFromEvent}
      icon={'lib_website_page_load'}
      group={defaultGroupings.pageLoad}
      beaconType={'pageLoad'}
      title={'Analyze Load Time'}
    />
  );
}

EumAlertButton.propTypes = {
  alertType: PropTypes.string.isRequired,
  tagFilters: PropTypes.array.isRequired,
  timeConfigFromEvent: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

function GoToAnalyzeButton({ websiteLabel, tagFilters, timeConfigFromEvent, icon, group, beaconType, title }) {
  return (
    <Button
      kind="primary"
      icon={icon}
      href$={getLinkToAnalyze({
        beaconType,
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        group
      })}
      timeConfig={timeConfigFromEvent}
    >
      {title}
    </Button>
  );
}
