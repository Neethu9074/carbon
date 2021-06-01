/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import { replaceFloatingActionButtons } from 'in-new-components/FloatingActionButton/stores/floatingActionButtons';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { emptyArray } from 'in-services/fixedObjects';

const useSideEffect = createSideEffectHook(
  args => args.reduce((agg, items) => agg.concat(items), emptyArray).filter(Boolean),
  replaceFloatingActionButtons
);

export default function FloatingActionButtons(props) {
  useSideEffect(props.items || props.children);
  return null;
}

FloatingActionButtons.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
};
