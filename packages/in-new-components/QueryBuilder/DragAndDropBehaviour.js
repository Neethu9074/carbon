import { stopPropagationAndPreventDefault } from 'in-services/util/function';

export default function DragAndDropBehaviour({
  fixDropIndex,
  formModelIndex,
  switchFormModelIndices,
  setDraggedFormModelIndex,
  dragEnabled = true,
  children
}) {
  const dragAndDropProps = {
    onDragOver: e => onDragOver(fixDropIndex, setDraggedFormModelIndex, e),
    onDrop: e => onDrop(fixDropIndex, switchFormModelIndices, setDraggedFormModelIndex, e)
  };
  if (dragEnabled) {
    // a flag supported by the native browser drag&drop implementation
    dragAndDropProps.draggable = true;
    dragAndDropProps.onDragStart = e => onDragStart(formModelIndex, e);
    dragAndDropProps.onDragEnd = () => onDragEnd(setDraggedFormModelIndex);
  }
  // needed on the onDrop handler to determine the index if it was not provided via fixDropIndex
  dragAndDropProps['data-form-model-index'] = formModelIndex;

  return children({ dragAndDropProps });
}

function onDragStart(dragIndex, e) {
  // attach data to the event so it can be read by elements with the onDrop handler
  e.dataTransfer.setData('text', dragIndex);
}

function onDragEnd(setDraggedFormModelIndex) {
  setDraggedFormModelIndex(null);
}

function onDragOver(fixDropIndex, setDraggedFormModelIndex, e) {
  stopPropagationAndPreventDefault(e);

  const destinationIndex = getNearestIndexOrFixed(e, fixDropIndex);
  setDraggedFormModelIndex(destinationIndex);
}

function onDrop(fixDropIndex, switchFormModelIndices, setDraggedFormModelIndex, e) {
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

function getNearestIndexOrFixed(e, fixDropIndex) {
  return fixDropIndex >= 0 ? fixDropIndex : getIndexFromElement(e.clientX, e.currentTarget);
}

function getIndexFromElement(mouseX, element) {
  // e.offsetX does not work here...
  const formModelIndex = Number.parseInt(element.dataset.formModelIndex); // set by droppableProps

  // checkts if the dragged element was dropped on he first half of the element.
  // if so, place the dragged element before the dropped one.
  // if not, place it after the dropped element
  const { left, width } = element.getBoundingClientRect();
  return mouseX < left + width / 2 ? formModelIndex : formModelIndex + 1;
}
