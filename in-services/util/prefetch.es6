'use strict';

export default function prefetch() {
  for (let i = 0; i < arguments.length; i++) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', arguments[i], true);
    xhr.send();
  }
}
