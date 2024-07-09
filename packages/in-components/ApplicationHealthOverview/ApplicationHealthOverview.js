/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link, Pagination as CarbonPagination } from '@instana/components';
import { Ul, Li } from '@instana/components';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';
import { carbonPaginationEnabled } from 'in-services/featureFlags';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Pagination from 'in-components/Pagination';

import locals from './ApplicationHealthOverview.mless';

const ApplicationHealthOverview = ({ applications, isPreview, timeConfig }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [key, setKey] = useState(0);
  const { ref, height, width } = useResizeObserver();
  const numPages = applications?.length && Math.ceil(applications.length / rowsPerPage);
  const updatePage = page => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (height && !isPreview) {
      setRowsPerPage(Math.floor(height / 48));
      setKey(k => k + 1);
    }
  }, [height, isPreview]);

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
        {numPages > 1 &&
          (carbonPaginationEnabled ? (
            <div key={key}>
              <CarbonPagination
                className={width < 500 ? locals.paginationSmallWidth : null}
                currentPage={currentPage}
                totalItems={applications?.length}
                pageSize={rowsPerPage}
                pageSizes={[rowsPerPage]}
                onChange={data => {
                  setCurrentPage(data.page);
                }}
              />
            </div>
          ) : (
            <div className={locals.pagination}>
              <Pagination currentPage={currentPage} numPages={numPages} onChange={updatePage} />
            </div>
          ))}
      </div>
    </section>
  );
};

const ApplicationRow = ({ application, timeConfig, isPreview }) => {
  const { openIssues, maxSeverity, id, label } = application;
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();

  return (
    <Li>
      {isPreview && label}
      {!isPreview && <Link href={getLinkToApplicationDashboard({ applicationId: id })}>{label}</Link>}
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
