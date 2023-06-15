/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactElement } from 'react';

import { Stack } from '@instana/components';

import Title from 'in-components/Title';

type Props = {
  title: string;
  children: ReactElement | ReactElement[];
};

const TabPane = ({ title, children }: Props): JSX.Element => {
  return (
    <Stack gap="small">
      <Title title={title} />
      <div>{children}</div>
    </Stack>
  );
};

export default TabPane;
