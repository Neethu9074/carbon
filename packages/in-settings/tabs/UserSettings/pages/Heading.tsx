/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Label from 'in-components/form/Label';

export default function Heading({ text, htmlFor }) {
  return <Label htmlFor={htmlFor}>{text}</Label>;
}
