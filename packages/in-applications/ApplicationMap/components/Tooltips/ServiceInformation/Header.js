/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SvgIcon } from '@instana/components';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';

import locals from './Header.mless';

export default function Header({ service }) {
  return (
    <Fragment>
      <div className={locals.labelRow}>
        <SvgIcon className={locals.serviceIcon} type="lib_application_service" />
        <span className={locals.label}>{service.label} </span>
      </div>

      <div className={locals.typeAndTechRow}>
        <div className={locals.types}>
          <EndpointTypeBadgeList types={service.types} />
        </div>
        <div className={locals.technologies}>
          <TechnologyIndicatorList technologies={service.technologies} responsive={false} />
        </div>
      </div>

      {service.numberOfOpenIssues > 0 && (
        <div className={locals.healthRow}>
          <HealthIndicatorButtonPresenter
            openIssues={service.numberOfOpenIssues}
            maxSeverity={service.maxSeverity}
            onClick={() => {}}
          />
        </div>
      )}
    </Fragment>
  );
}
