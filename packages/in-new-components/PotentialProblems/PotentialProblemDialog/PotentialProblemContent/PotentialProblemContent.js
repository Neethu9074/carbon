import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemContentControls from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemContentControls';
import PotentialProblemChart from 'in-new-components/PotentialProblems/PotentialProblemDialog/PotentialProblemContent/PotentialProblemChart';
import {
  getIconByType,
  getType
} from 'in-new-components/PotentialProblems/PotentialProblemDialog/potentialProblemsDialogUtil';
import { getDescription, getTitle } from 'in-new-components/PotentialProblems/textUtil';
import { formatDateTime } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon';

import locals from './PotentialProblemContent.mless';

export default function PotentialProblemContent({
  alert,
  alertConfigs,
  selectedItem,
  applicationLabel,
  serviceLabel,
  endpointLabel,
  ...remainingProps
}) {
  const alertType = alertConfigs[selectedItem.key].rule.alertType;
  const alertConfig = alertConfigs[alertType] ?? alertConfigs[selectedItem.key];
  const type = getType({ applicationLabel, serviceLabel, endpointLabel });

  return (
    <div className={locals.container}>
      <div className={locals.contentHeader}>
        <div className={locals.headline}>{getTitle({ ...alertConfig })}</div>
        <div className={locals.entity}>
          <SvgIcon size="s" className={locals.icon} type={getIconByType(type)} />
          {getLabelText({
            applicationLabel,
            serviceLabel,
            endpointLabel
          })}
        </div>
        <div className={locals.duration}>
          <SvgIcon size="xs" className={locals.icon} type="lib_datetime_time" />
          <time dateTime={new Date(alert.start).toISOString()}>{formatDateTime(alert.start)}</time>
          <div className={locals.durationDevider}>—</div>
          <time dateTime={new Date(alert.end).toISOString()}>{formatDateTime(alert.end)}</time>
        </div>
        <div className={locals.description}>{getDescription({ ...alertConfig, alertType })}</div>
      </div>
      <div className={locals.chartWrapper}>
        <PotentialProblemChart {...remainingProps} alertConfig={alertConfig} alert={alert} alertType={alertType} />
      </div>
      <div className={locals.controls}>
        <PotentialProblemContentControls
          {...remainingProps}
          applicationLabel={applicationLabel}
          alertType={alertType}
          alertConfig={alertConfig}
          alert={alert}
        />
      </div>
    </div>
  );
}

function getLabelText({ applicationLabel, serviceLabel, endpointLabel }) {
  const Icon = <SvgIcon size="xs" className={locals.icon} type="lib_arrow_expand_right" />;
  return (
    <>
      {applicationLabel}{' '}
      {serviceLabel ? (
        <>
          {Icon}
          {serviceLabel}
        </>
      ) : null}{' '}
      {endpointLabel ? (
        <>
          {Icon}
          {endpointLabel}
        </>
      ) : null}
    </>
  );
}

PotentialProblemContent.propTypes = {
  alert: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number.isRequired
  }).isRequired,
  alertConfigs: PropTypes.object.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  endpointLabel: PropTypes.string,
  selectedItem: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired,
  serviceLabel: PropTypes.string
};
