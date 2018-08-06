import React from 'react';

import { DescriptionItem } from 'in-components/DescriptionList';
import { isBlank } from 'in-services/util/string';
import Code from 'in-components/Code';

export default function ErrorDescriptionItem({ error }) {
  if (isBlank(error)) {
    return null;
  }

  return (
    <DescriptionItem title="Error">
      <Code code={error} lang="plain" softWrap />
    </DescriptionItem>
  );
}
