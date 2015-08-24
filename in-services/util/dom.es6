export function applyTransform(ele, transform) {
  const style = ele.style;
  style.transform = transform;
  style['-webkit-transform'] = transform; // required for Safari (2015-08-24)
}
