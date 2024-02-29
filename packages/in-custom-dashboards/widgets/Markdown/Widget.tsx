/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import DOMPurify from 'dompurify';
import React from 'react';

import { Card, CardProps } from '@instana/components';

import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { toHtml } from 'in-services/formatters/markdown';

import locals from './Widget.mless';

interface MarkdownWidgetProps extends Pick<CardProps, 'title'> {
  actions: React.ReactNode;
  config?: string;
  isPreview?: boolean;
  isInModal?: boolean;
  dragHandle: React.ReactNode;
}

export default function MarkdownWidget({
  title,
  actions,
  isPreview,
  dragHandle,
  isInModal,
  config: markdown
}: MarkdownWidgetProps) {
  return (
    <Card
      title={title}
      rightHeaderContent={
        isInModal ? undefined : (
          <>
            {dragHandle}
            {actions}
          </>
        )
      }
      useMaxAvailableHeight={!isPreview}
      className={classNames({
        [locals.modal]: isInModal
      })}
      bodyClassName={classNames({
        [locals.modal]: isInModal
      })}
      headerClassName={classNames({
        [locals.modal]: isInModal
      })}
      isScrollable
    >
      <DangerousHtmlPresenter className={locals.markdown} html={DOMPurify.sanitize(toHtml(markdown || ''))} />
    </Card>
  );
}
