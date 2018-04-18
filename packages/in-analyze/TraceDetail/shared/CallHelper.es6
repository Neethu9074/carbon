export function hasOnlyExitSpan(call) {
  return call.spans && call.spans.length == 1 && call.spans[0].kind == 'EXIT';
}
