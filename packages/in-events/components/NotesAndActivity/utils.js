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
          updated: x.get('updated'),
          data: x.get('data'),
          label: x.get('label'),
          origin: x.get('origin')
        };
      }) || [];
  return notes;
}

// Filters through the notes to make sure a notes includes
// the search input in either the author name or contents
// Searches through:
// - author
// - origin
// - contents
// - data
export function filterSearchNotes(notes, input) {
  const result = notes?.filter(note => {
    const dataString = [];
    const author = note?.author?.toLowerCase() || '';
    const contents = note?.contents?.toLowerCase() || '';
    const origin = note?.origin?.toLowerCase() || '';
    // Go through the data and extract all the values
    note?.data?.map(entry => {
      const entryArray = entry?._tail?.array;
      dataString.push(entryArray);
    });
    // flatten to one long string for ease of searching through data
    const searchableData = dataString.flat(1).join().toLowerCase();
    return (
      author.includes(input) || contents.includes(input) || origin.includes(input) || searchableData.includes(input)
    );
  });

  return result;
}
