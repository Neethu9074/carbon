/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback } from 'react';
import classNames from 'classnames';

import { Button } from '@instana/legacy';

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
    <li
      className={classNames({
        [locals.title]: true,
        [locals.active]: isActive
      })}
    >
      <Button kind="action" onClick={handleOnClick}>
        {title}
      </Button>
    </li>
  );
};

export default TabTitle;
