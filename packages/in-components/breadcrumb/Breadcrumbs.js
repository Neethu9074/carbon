/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { replaceBreadcrumbs } from 'in-components/breadcrumb/stores/breadcrumbs';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { emptyArray } from 'in-services/fixedObjects';

const useSideEffect = createSideEffectHook(
  args => args.reduce((agg, items) => agg.concat(items), emptyArray).filter(Boolean),
  replaceBreadcrumbs
);

export default function Breadcrumbs({ items }) {
  useSideEffect(items);
  return null;
}
