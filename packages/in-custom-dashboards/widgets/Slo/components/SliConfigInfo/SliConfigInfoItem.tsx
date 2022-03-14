/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Nullish } from 'in-types';

import locals from './SliConfigInfo.mless';

interface SliConfigInfoItemProps {
  label: string;
  value: string | Nullish;
}

export default function SliConfigInfoItem({ label, value }: SliConfigInfoItemProps) {
  return (
    <>
      <div className={locals.sliConfigLabel}>{label}</div>
      <div className={locals.sliConfigValue}>{value}</div>
    </>
  );
}
