/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link, SvgIcon } from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { useLinkToApplicationDashboard } from 'in-applications/navigation/paths';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

interface Props {
  applicationId: string;
  applicationLabel: string;
  shouldDisplayLink: boolean | undefined;
}

const ApplicationLabelContent = ({ applicationId, applicationLabel, shouldDisplayLink = true }: Props) => {
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();

  if (applicationLabel != null && applicationLabel !== '') {
    return (
      <HorizontalFlexWrapper>
        <SvgIcon type={'lib_application_invert'} />
        <div>
          {shouldDisplayLink ? (
            <Link href={applicationId && getLinkToApplicationDashboard({ applicationId })}>
              <span className={locals.label} title="linked">
                {applicationLabel}
              </span>
            </Link>
          ) : (
            <span className={locals.label} title="notLinked">
              {applicationLabel}
            </span>
          )}
        </div>
      </HorizontalFlexWrapper>
    );
  }

  return (
    <div>
      <span className={locals.label} title="empty">
        {''}
      </span>
    </div>
  );
};

export default ApplicationLabelContent;
