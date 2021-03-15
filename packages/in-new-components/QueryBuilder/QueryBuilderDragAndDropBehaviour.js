/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getNearestDomElement } from 'in-new-components/QueryBuilder/keyboardInteraction';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';

export default function DragAndDropBehaviour({
  switchFormModelIndices,
  queryBuilderRef,
  setDraggedFormModelIndex,
  totalItems,
  children
}) {
  return children({
    dragAndDropProps: {
      onDragOver,
      onDrop
    }
  });

  function onDragOver(e) {
    stopPropagationAndPreventDefault(e);
    setDraggedFormModelIndex(getClosestElementDropIndex(e) || null);
  }

  function onDrop(e) {
    setDraggedFormModelIndex(null);

    // read data given by the onDragStart handler
    const sourceIndex = Number.parseInt(e.dataTransfer.getData('text'));
    switchFormModelIndices(sourceIndex, getClosestElementDropIndex(e) || totalItems);
  }

  function getClosestElementDropIndex(e) {
    const closestElement = getNearestDomElement(
      e,
      queryBuilderRef.current.querySelectorAll('[data-query-builder-space-element]')
    );

    if (closestElement) {
      return Number.parseInt(closestElement.dataset.dropIndex);
    }
  }
}
