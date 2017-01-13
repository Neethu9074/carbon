import {create} from 'reactive-observables';

export function onImageLoad(url) {
  const result = create();

  const img = new Image();
  img.onload = () => result.emit(url);
  img.src = url;

  return result;
}
