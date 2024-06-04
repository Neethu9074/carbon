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

// Creating date format of
// YYYY-mm-dd, HH:MM:SS
export function formatDate(date) { 
  const dateString =
    date.getFullYear() + "-" +
    ("0"+(date.getMonth()+1)).slice(-2) + "-" +
    ("0" + date.getDate()).slice(-2)
    + ", " +
    ("0" + date.getHours()).slice(-2) + ":" +
    ("0" + date.getMinutes()).slice(-2) + ":" +
    ("0" + date.getSeconds()).slice(-2);

  return dateString
}