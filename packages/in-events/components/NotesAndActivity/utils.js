/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// Function to filter through and take in notes Object
// eventObj: journals || notesUiObjects
// Types:
// - note
// - external_note
// - external_field_change
export function getNotes(event) {
  const notes =
    (event?.get('journals') || event?.get('notesUiObjects'))
      ?.toArray()
      .filter(
        x =>
          x && (x.get('type') == 'note' || x.get('type') == 'external_note' || x.get('type') == 'external_field_change')
      )
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

// Filters through the notes to make sure a notes includes
// the search input in either the author name or contents
export function filterSearchNotes(notes, input) {
  const result = notes?.filter(note => {
    const author = note?.author?.toLowerCase() || '';
    const contents = note?.contents?.toLowerCase() || '';
    // Flatten the array of arrays down
    const data = note?.data?.flat(1) || [];
    // Loop through the data and see the input is found
    // The created boolean area is checked in the next step to see
    // At least one true exists
    const dataBools = data.map(e => e.toLowerCase().includes(input));
    return author.includes(input) || contents.includes(input) || dataBools.includes(true);
  });

  return result;
}
