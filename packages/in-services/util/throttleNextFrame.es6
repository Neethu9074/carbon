export default function throttleNextFrame(fn) {
  let handle;
  let latestData;

  return function nextFrameThrottled(arg) {
    latestData = arg;

    if (handle == null) {
      handle = requestAnimationFrame(() => {
        handle = null;
        fn(latestData);
      });
    }
  };
}
