/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer, Stack } from '@instana/components';

//@ts-expect-error type declaration not available for the below component
import ExpandableCard from 'in-components/ExpandableCard';

import locals from 'in-plg/components/Card/ExpandableCard/OnboardingExpandCard.mless';

interface ExpandableCardProps {
  title: string;
  body: JSX.Element;
  openByDefault: boolean;
}

const OnboardingExpandCard: React.FC<ExpandableCardProps> = ({ title, body, openByDefault = false }) => {
  return (
    <>
      <ExpandableCard
        title={title}
        className={locals.expandableCard}
        headerClassName={locals.expandableCardHeader}
        bodyClassName={locals.expandableCardBody}
        openByDefault={openByDefault}
      >
        <Stack>
          <Spacer />
          {body}
        </Stack>
      </ExpandableCard>
    </>
  );
};

export default OnboardingExpandCard;
