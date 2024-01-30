/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import { Di } from 'in-components/HorizontalDescriptionList';
import { isBlank } from 'in-services/util/string';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

export default function ErrorDescriptionItem({ error }) {
  if (typeof error !== 'string' || isBlank(error)) {
    return null;
  }

  return (
    <Di
      title={t('in-sdk:traceDetails.errorDescription')}
      style={{ color: themes.default.ids.color.option.red['500'] }}
      verticalDisplay
    >
      <Code code={error} lang="plain" softWrap showLineNumbers={false} />
    </Di>
  );
}
