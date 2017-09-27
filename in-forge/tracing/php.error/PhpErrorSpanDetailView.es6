import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

const errorLevelTranslation = {
  1: 'E_ERROR',
  4: 'E_PARSE',
  16: 'E_CORE_ERROR',
  64: 'E_COMPILE_ERROR',
  256: 'E_USER_ERROR',
  4096: 'E_RECOVERABLE_ERROR'
};

export default function PhpErrorSpanDetailView({ span }) {
  const errorLevel = span.getIn(['data', 'error', 'level']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Message">{span.getIn(['data', 'error', 'msg'])}</DescriptionItem>
        <DescriptionItem title="Class">{span.getIn(['data', 'error', 'class'])}</DescriptionItem>
        <DescriptionItem title="Level">{errorLevel != null ? errorLevelTranslation[errorLevel] : null}</DescriptionItem>
        <DescriptionItem title="Function/Method">{span.getIn(['data', 'error', 'function'])}</DescriptionItem>
        <DescriptionItem title="Type">{span.getIn(['data', 'error', 'type'])}</DescriptionItem>
        <DescriptionItem title="File">{span.getIn(['data', 'error', 'file'])}</DescriptionItem>
        <DescriptionItem title="Line">{span.getIn(['data', 'error', 'line'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
