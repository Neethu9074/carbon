/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Label from 'in-components/form/Label';

interface HeadingProps {
  text: React.ReactNode;
  htmlFor?: string;
}

export default function Heading({ text, htmlFor }: HeadingProps) {
  return <Label htmlFor={htmlFor}>{text}</Label>;
}
