/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import DOMPurify from 'dompurify';
import React from 'react';

import { Card } from '@instana/components';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';

import locals from './Widget.mless';

export default function MarkdownWidget({ title, actions, isPreview, dragHandle, config: markdown }) {
  return (
    <Card
      title={title}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
      useMaxAvailableHeight={!isPreview}
    >
      <DangerousHtmlPresenter className={locals.markdown} html={DOMPurify.sanitize(toHtml(markdown || ''))} />
    </Card>
  );
}
