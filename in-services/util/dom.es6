const supportsTransformWithOutPrefix = 'transform' in document.body.style;

export function applyTransform(ele, transform) {
  if (!supportsTransformWithOutPrefix) {
    // required for Safari (2015-08-24)
    ele.style['-webkit-transform'] = transform;
  } else {
    ele.style.transform = transform;
  }
}

export function scrollIntoViewIfNeeded(element) {
  if (element.scrollIntoViewIfNeeded) {
    element.scrollIntoViewIfNeeded();
  }
}
