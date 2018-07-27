import React from 'react';

import { showRawData as showRawDataMatrixParameter } from 'in-analyze/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { analyze } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';

export default function BackToGroupButton(props) {
  const { onClick } = props;

  return (
    <Button href$={getLinkAnalyze()} size="compact" icon="lib_arrow_left" kind="secondary" onClick={onClick}>
      Analyze
    </Button>
  );
}

function getLinkAnalyze() {
  return getModifiedUrlStream(params => {
    params.pathname = analyze;
    setOrDeleteMatrixKey(params, analyze, showRawDataMatrixParameter, null);
  });
}
