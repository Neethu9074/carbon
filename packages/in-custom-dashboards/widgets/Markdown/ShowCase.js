/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import MarkdownWidget from 'in-custom-dashboards/widgets/Markdown/Widget';
import { t } from 'in-i18n';

import locals from './ShowCase.mless';

export default function ShowCase() {
  return (
    <div className={locals.wrapper}>
      <MarkdownWidget
        title={t('in-custom-dashboards:widgets.markdown.demo.title')}
        isPreview
        config={t('in-custom-dashboards:widgets.markdown.demo.text')}
      />
    </div>
  );
}
