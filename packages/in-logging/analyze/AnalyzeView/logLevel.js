export function getLogLevel(log) {
  const match = log.tags.filter(({ tag }) => tag.label === 'log.level')[0];
  return match ? match.value : undefined;
}
