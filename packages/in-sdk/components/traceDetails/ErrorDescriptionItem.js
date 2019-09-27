import React from 'react';

import { DescriptionItem } from 'in-components/DescriptionList';
import { isBlank } from 'in-services/util/string';
import Code from 'in-components/Code';
import theme from 'in-themes';

export default function ErrorDescriptionItem({ error }) {
  if (isBlank(error)) {
    return null;
  }

  return (
    <DescriptionItem title="Error" style={{ color: theme.lib.colors.failure }} verticalDisplay>
      <Code code={error} lang="plain" softWrap />
    </DescriptionItem>
  );
}
