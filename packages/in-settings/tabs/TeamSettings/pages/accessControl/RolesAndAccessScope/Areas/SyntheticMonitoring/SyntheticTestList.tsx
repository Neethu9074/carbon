/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Li, Typography } from '@instana/components';
import { SyntheticTest } from '@instana/types';

/**
 * Proprerties for this component
 */
interface Props {
  syntheticTestsToDisplay: SyntheticTest[];
}

/**
 * Creates an instance of the component
 * @param param0 see props
 * @returns new instance
 */
export const SyntheticTestList = ({ syntheticTestsToDisplay }: Props) => {
  return (
    <>
      {syntheticTestsToDisplay.map(syntheticTest => (
        <Li noAlternatingBg key={syntheticTest.id}>
          <Typography variant="body-regular" component="span">
            {syntheticTest.label}
          </Typography>
        </Li>
      ))}
    </>
  );
};
