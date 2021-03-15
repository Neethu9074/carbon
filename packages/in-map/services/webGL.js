/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// https://www.khronos.org/webgl/wiki/FAQ
// it is recommended that you check for success or failure to initialize.
// if WebGL fails to initialize it is recommended you distinguish between failure
// because the browser doesn't support WebGL and failure for some other reason.
// if the browser does not support WebGL then the map will not be rendered.
// you can determine if the browser supports WebGL by checking for the existence of WebGLRenderingContext.
export function isWebGLSupported() {
  return window.WebGLRenderingContext ? true : false;
}

export function getWebGLCanvasContext(canvas) {
  let context = null;
  if (!canvas) {
    return context;
  }

  // browser supports WebGL but if the canvas.getContext('webgl') returns null
  // then WebGL failed for some reason other than user's browser (no GPU, out of memory, etc...)
  const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
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
  // if context is != null, the browser supports WebGL and initialization worked.
  return context;
}
