import { createField, notBlankValidator } from 'formalistic';
import { find } from 'lodash';

export function createForm(form, savedState) {
  const tagFilters = savedState?.tagFilters ?? [];
  return form
    .put(
      'tagFilters',
      createField({
        // Not the best formalistic style, but since we do not need any validation on
        // tag filters and since all tag filter components directly operate on the raw
        // data structure, this is easier to do.
        value: tagFilters
      })
    )
    .put(
      'beaconType',
      createField({
        value: getBeaconType(tagFilters),
        validator: notBlankValidator
      })
    );
}

function getBeaconType(tagFilters) {
  const tagFilter = find(tagFilters, ({ name }) => name === 'beacon.type');
  if (tagFilter == null) {
    return '';
  }
  return tagFilter.stringValue;
}
