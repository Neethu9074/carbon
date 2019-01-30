export default function clear(config) {
  config.backBufferCtx.clearRect(0, 0, config.backBufferWidth, config.height);
}
