/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import KpiGridRow from 'in-new-components/KpiGridRow/KpiGridRow';
import KpiCard from 'in-new-components/KpiCard/KpiCard';

export default {
  title: 'Molecules|KpiGridRow',
  component: KpiGridRow
};

export function Default() {
  return (
    <>
      <h2>Single Row</h2>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
      </KpiGridRow>

      <h2>Multi Row</h2>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
      </KpiGridRow>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
      </KpiGridRow>
    </>
  );
}
