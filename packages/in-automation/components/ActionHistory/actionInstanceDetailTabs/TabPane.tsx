/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactElement } from 'react';

import Title from 'in-components/Title';

type Props = {
  title: string;
  children: ReactElement | ReactElement[];
};

const TabPane = ({ title, children }: Props): JSX.Element => {
  return (
    <div>
      <Title title={title} />
      <div>{children}</div>
    </div>
  );
};

export default TabPane;
