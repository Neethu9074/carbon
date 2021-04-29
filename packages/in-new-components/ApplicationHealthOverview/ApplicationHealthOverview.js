/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useEffect } from 'react';
import { Link } from '@instana/components';
import PropTypes from 'prop-types';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import useResizeObserver from 'in-hooks/useResizeObserver';
import { Ul, Li } from 'in-new-components/lists/List';
import Pagination from 'in-new-components/Pagination';

import locals from './ApplicationHealthOverview.mless';

const ApplicationHealthOverview = ({ applications, isPreview, timeConfig }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const { ref, height } = useResizeObserver();
  const numPages = applications?.length && Math.ceil(applications.length / rowsPerPage);

  const updatePage = page => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (height && !isPreview) {
      setRowsPerPage(Math.floor(height / 48));
    }
  }, [height]);
  return (
    <section className={locals.container}>
      <div className={locals.content} ref={ref}>
        <Ul>
          {applications.map((application, index) => {
            if (index < currentPage * rowsPerPage && index >= (currentPage - 1) * rowsPerPage) {
              return (
                <ApplicationRow key={index} application={application} timeConfig={timeConfig} isPreview={isPreview} />
              );
            }
          })}
        </Ul>
      </div>
      {numPages > 1 && (
        <div className={locals.pagination}>
          <Pagination currentPage={currentPage} numPages={numPages} onChange={updatePage} />
        </div>
      )}
    </section>
  );
};

const ApplicationRow = ({ application, timeConfig, isPreview }) => {
  const { openIssues, maxSeverity, id, label } = application;
  return (
    <Li>
      {isPreview && label}
      {!isPreview && <Link href$={getApplicationDashboard(id)}>{label}</Link>}
      <div className={isPreview ? locals.disabledHealthIndicator : locals.healthIndicator}>
        <ApplicationEntityHealthIndicatorBehavior
          applicationId={id}
          IndicatorPresenter={HealthIndicatorPresenter}
          openIssues={openIssues}
          maxSeverity={maxSeverity}
          timeConfig={timeConfig}
        />
      </div>
    </Li>
  );
};

ApplicationHealthOverview.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      openIssues: PropTypes.number,
      maxSeverity: PropTypes.number
    })
  ),
  isPreview: PropTypes.bool,
  timeConfig: PropTypes.object.isRequired
};

export default ApplicationHealthOverview;
