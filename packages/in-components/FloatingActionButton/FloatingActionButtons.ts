/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { replaceFloatingActionButtons } from 'in-components/FloatingActionButton/stores/floatingActionButtons';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { emptyArray } from 'in-services/fixedObjects';

const useSideEffect = createSideEffectHook(
  (args: any[]) => args.reduce((agg, items) => agg.concat(items), emptyArray).filter(Boolean),
  replaceFloatingActionButtons
);

interface Props {
  items?: Element[];
  children?: React.ReactNode;
}

export default function FloatingActionButtons(props: Props) {
  useSideEffect(props.items || props.children);
  return null;
}
