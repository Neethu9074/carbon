/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';

import locals from './ArticleContent.mless';

export default function ArticleContent({ markdownContent }: { markdownContent: string }): JSX.Element {
  return <DangerousHtmlPresenter className={locals.content} html={toHtml(markdownContent)} />;
}
