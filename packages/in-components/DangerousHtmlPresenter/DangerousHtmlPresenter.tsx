/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-danger */
import React from 'react';

interface Props {
  html: string;
  className?: string;
}

export default function DangerousHtmlPresenter({ html, className }: Props) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
