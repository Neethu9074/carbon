/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getNotes(event) {
  const notes = event
    ?.get('notesUiObjects')
    ?.toArray()
    .filter(x => x && x.get('type') == 'note')
    .map(x => {
      return {
        type: x.get('type'),
        id: x.get('id'),
        parent: x.get('parent'),
        timestamp: x.get('timestamp'),
        author: x.get('author'),
        metadata: x.get('metadata'),
        contents: x.get('contents'),
        updated: x.get('updated')
      };
    }) || [];
  return notes;
}