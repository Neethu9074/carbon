/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-disable react/no-danger */
import React from 'react';

export default function DangerousHtmlPresenter({ html, className }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
