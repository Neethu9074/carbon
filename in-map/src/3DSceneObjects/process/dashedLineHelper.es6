export function getPartsForCount(numLines) {
  const parts = [];
  let progress = 0;

  for (let i = 1; i <= numLines; i++) {
    const newProgress = (i / numLines);

    parts.push(progress, newProgress - (0.5 / numLines));

    progress = newProgress;
  }

  parts[parts.length - 1] = 1;

  return parts;
}
