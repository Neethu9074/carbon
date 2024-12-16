/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Typography } from '@instana/components';
import { ApplicationConfig } from '@instana/types';

import { SubsectionHeader } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/SubsectionHeader/SubsectionHeader';

interface ApplicationSubsectionProps {
  headerText?: string;
  applicationsToDisplay?: ApplicationConfig[];
}

export const ApplicationSubsection = ({ headerText, applicationsToDisplay }: ApplicationSubsectionProps) => {
  const sublistContent = applicationsToDisplay?.map(applicationData => {
    return (
      <Li noAlternatingBg key={applicationData.id}>
        <Typography variant="body-regular">{applicationData.label}</Typography>
      </Li>
    );
  });
  return (
    <>
      {headerText && <SubsectionHeader headerText={headerText} />}
      {sublistContent}
    </>
  );
};
