/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function requestAnimationFrameWithFps(callbackFn: () => void, fps: number) {
  const fpsInterval = 1000 / fps;
  let prevExecutionTime = Date.now();
  let requestId: number;

  animate();

  return {
    cancel
  };

  function animate() {
    requestId = requestAnimationFrame(animate);

    const now = Date.now();
    const elapsed = now - prevExecutionTime;
    if (elapsed > fpsInterval) {
      prevExecutionTime = now;
      callbackFn();
    }
  }

  function cancel() {
    cancelAnimationFrame(requestId);
  }
}
