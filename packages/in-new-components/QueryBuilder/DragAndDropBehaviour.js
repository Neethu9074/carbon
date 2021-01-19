/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { stopPropagationAndPreventDefault } from 'in-services/util/function';

export default function DragAndDropBehaviour({
  fixDropIndex,
  formModelIndex: dragIndex,
  switchFormModelIndices,
  setDraggedFormModelIndex,
  dragEnabled = true,
  children
}) {
  const dragAndDropProps = {
    onDragOver,
    onDrop
  };
  if (dragEnabled) {
    // a flag supported by the native browser drag&drop implementation
    dragAndDropProps.draggable = true;
    dragAndDropProps.onDragStart = onDragStart;
    dragAndDropProps.onDragEnd = onDragEnd;
  }
  // needed on the onDrop handler to determine the index if it was not provided via fixDropIndex
  dragAndDropProps['data-drop-index'] = fixDropIndex || dragIndex;

  return children({ dragAndDropProps });

  function onDragStart(e) {
    // attach data to the event so it can be read by elements with the onDrop handler
    e.dataTransfer.setData('text', dragIndex);
    e.currentTarget.style.opacity = '0.4';
  }

  function onDragEnd(e) {
    setDraggedFormModelIndex(null);
    e.currentTarget.style.opacity = '1';
  }

  function onDragOver(e) {
    stopPropagationAndPreventDefault(e);

    const destinationIndex = getNearestIndexOrFixed(e, fixDropIndex);
    setDraggedFormModelIndex(destinationIndex);
  }

  function onDrop(e) {
    stopPropagationAndPreventDefault(e);
    setDraggedFormModelIndex(null);

    // read data given by the onDragStart handler
    const sourceIndex = Number.parseInt(e.dataTransfer.getData('text'));

    let destinationIndex = getNearestIndexOrFixed(e, fixDropIndex);
    // because the source index will get deleted, we are so kind here to already provide the correct replacement index
    if (sourceIndex < destinationIndex) {
      destinationIndex--;
    }

    switchFormModelIndices(sourceIndex, destinationIndex);
  }
}

function getNearestIndexOrFixed(e, fixDropIndex) {
  return fixDropIndex >= 0 ? fixDropIndex : getIndexFromElement(e.clientX, e.currentTarget);
}

function getIndexFromElement(mouseX, element) {
  // e.offsetX does not work here...
  const formModelIndex = Number.parseInt(element.dataset.dropIndex); // set by droppableProps

  // checkts if the dragged element was dropped on he first half of the element.
  // if so, place the dragged element before the dropped one.
  // if not, place it after the dropped element
  const { left, width } = element.getBoundingClientRect();
  return mouseX < left + width / 2 ? formModelIndex : formModelIndex + 1;
}
