/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';

import locals from './ArticleContent.mless';

export default function ArticleContent({ markdownContent }) {
  return <DangerousHtmlPresenter className={locals.content} html={toHtml(markdownContent)} />;
}

ArticleContent.propTypes = {
  markdownContent: rpt.string.isRequired
};
