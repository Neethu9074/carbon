/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback } from 'react';

import { Button } from '@instana/components';

import locals from './tabTitle.mless';

export type TabTitleProps = {
  title: string;
  index: number;
  setSelectedTab: (index: number) => void;
  isActive?: boolean;
};

const TabTitle = (props: TabTitleProps): JSX.Element => {
  const { title, setSelectedTab, index, isActive } = props;

  const handleOnClick = useCallback(() => {
    setSelectedTab(index);
  }, [setSelectedTab, index]);

  return (
    <li className={`${locals.title} ${isActive ? 'active' : ''}`}>
      <Button kind="action" onClick={handleOnClick}>
        {title}
      </Button>
    </li>
  );
};

export default TabTitle;
