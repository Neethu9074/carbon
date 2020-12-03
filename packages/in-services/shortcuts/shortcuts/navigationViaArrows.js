import { leftArrowId, rightArrowId } from 'in-new-components/AnalyzeView/SplitScreenList/elementIds';

export function onLeftArrow(e) {
  tryClick(e, leftArrowId);
}

export function onRightArrow(e) {
  tryClick(e, rightArrowId);
}

function tryClick(keyboardEvent, id) {
  const ele = document.getElementById(id);
  if (ele == null) {
    return;
  }

  const clickEvent = document.createEvent('Events');
  clickEvent.initEvent('click', true, false);
  ele.dispatchEvent(clickEvent);
  keyboardEvent.preventDefault();
  keyboardEvent.stopPropagation();
}
