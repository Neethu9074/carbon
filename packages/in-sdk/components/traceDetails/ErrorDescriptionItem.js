import React from 'react';

import { Di } from 'in-new-components/HorizontalDescriptionList';
import { isBlank } from 'in-services/util/string';
import Code from 'in-components/Code';
import theme from 'in-themes';

export default function ErrorDescriptionItem({ error }) {
  if (isBlank(error)) {
    return null;
  }

  return (
    <Di title="Error" style={{ color: theme.lib.colors.failure }} verticalDisplay>
      <Code code={error} lang="plain" softWrap />
    </Di>
  );
}
