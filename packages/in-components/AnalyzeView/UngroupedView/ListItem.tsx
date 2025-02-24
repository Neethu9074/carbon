/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { ColumnizedContent, Li } from '@instana/components';

import { ListItemProps } from 'in-components/AnalyzeView/UngroupedView/types';

export const ListItem = (props: ListItemProps) => {
  const { isInitiallyToggled = false, item, href, className, renderNestedContent, onToggleContentRow } = props;

  const [isToggled, setIsToggled] = useState(isInitiallyToggled);

  const tracking = {
    onToggleContentRow: (toggled: boolean) => {
      onToggleContentRow(toggled, item);
      setIsToggled(toggled);
    }
  };

  return (
    <Li
      className={className}
      size="compact"
      href={href}
      renderNestedContent={renderNestedContent}
      initiallyOpen={isToggled}
      tracking={tracking}
      toggleContentOnRowClick
      noAlternatingBg
    >
      <ColumnizedContent isToggled={isToggled} {...item} {...props} />
    </Li>
  );
};
