import {create} from 'reactive-observables';


// https://www.khronos.org/webgl/wiki/FAQ
// it is recommended that you check for success or failure to initialize.
// if WebGL fails to initialize it is recommended you distinguish between failure
// because the browser doesn't support WebGL and failure for some other reason.
// if the browser does not support WebGL then the map will not be rendered.
// you can determine if the browser supports WebGL by checking for the existence of WebGLRenderingContext.
export function isWebGLSupported(canvas) {
  if (window.WebGLRenderingContext) {
    // browser supports WebGL but if the canvas.getContext('webgl') returns null
    // then WebGL failed for some reason other than user's browser (no GPU, out of memory, etc...)
    if (canvas && getWebGLCanvasContext(canvas)) {
      // browser supports WebGL and initialization worked.
      return true;
    }
  }
  return false;
}

export function getWebGLCanvasContext(canvas) {
  const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
  let context = null;
  for (let ii = 0; ii < names.length; ++ii) {
    try {
      context = canvas.getContext(names[ii]);
    } catch (e) {
      continue;
    }
    if (context) {
      break;
    }
  }
  return context;
}


export const isContextLost$ = create();

export const contextIsLost = () => isContextLost$.emit(true);
export const contextIsAvailable = () => isContextLost$.emit(false);
