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

// Calculate the position of an element relative to the document root;
export function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  const clientTop = docEl.clientTop || body.clientTop || 0;
  const clientLeft = docEl.clientLeft || body.clientLeft || 0;

  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
}
