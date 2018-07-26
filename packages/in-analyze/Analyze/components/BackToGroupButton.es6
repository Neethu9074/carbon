import React from 'react';

import Button from 'in-new-components/Button';

export default function BackToGroupButton(props) {
  const { onClick } = props;

  return (
    <Button size="compact" icon="lib_arrow_left" kind="secondary" onClick={onClick}>
      Analyze
    </Button>
  );
}
