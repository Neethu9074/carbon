import React from 'react';
import { getLinkToGroupedData } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';

import locals from './BackToGroupButton.mless';

export default function BackToGroupButton(props) {
  const { onClick } = props;

  return (
    <Button
      className={locals.button}
      href$={getLinkToGroupedData()}
      size="compact"
      icon="lib_arrow_left"
      kind="secondary"
      onClick={onClick}
    >
      Analyze
    </Button>
  );
}
