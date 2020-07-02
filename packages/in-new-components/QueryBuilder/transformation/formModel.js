export const OPEN_BRACKET = 'OPEN_BRACKET';
export const CLOSE_BRACKET = 'CLOSE_BRACKET';
export const TAG = 'TAG';
export const CONJUNCTION = 'CONJUNCTION';

export function createTagFilter({ type, name, stringValue, numberValue, booleanValue, operator, entity }) {
  const mappedTag = { type, name, operator, entity };
  if (stringValue !== undefined) {
    mappedTag.stringValue = stringValue;
  }
  if (numberValue !== undefined) {
    mappedTag.numberValue = numberValue;
  }
  if (booleanValue !== undefined) {
    mappedTag.booleanValue = booleanValue;
  }
  return mappedTag;
}
