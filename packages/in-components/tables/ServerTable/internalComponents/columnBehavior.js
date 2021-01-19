/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function filterColumns(props) {
  const {
    columnDefinitions,
    filterColumnDefinitions = () => () => true,
    optionalColumns,
    disabledColumns = [],
    enabledColumns = [],
    onChange
  } = props;
  const availableColumns = columnDefinitions.filter(filterColumnDefinitions(props));

  let visibleColumns = availableColumns;
  const containsOptionalColumns = optionalColumns && optionalColumns.length > 0;
  if (containsOptionalColumns) {
    visibleColumns = availableColumns.filter(
      def => disabledColumns.indexOf(def.id) === -1 && (!def.defaultDisabled || enabledColumns.indexOf(def.id) >= 0)
    );
  }

  return {
    availableColumns,
    visibleColumns,
    optionalColumns,
    onColumnChecked: (columnId, checked) =>
      onColumnChecked(onChange, disabledColumns, enabledColumns, columnId, checked)
  };
}

function onColumnChecked(onChange, disabledColumns, enabledColumns, columnId, checked) {
  const disabledIdx = disabledColumns.indexOf(columnId);
  const enabledIdx = enabledColumns.indexOf(columnId);
  if (checked) {
    if (disabledIdx >= 0) {
      onChange({ disabledColumns: disabledColumns.filter(c => c !== columnId) });
    } else {
      onChange({ enabledColumns: [...enabledColumns, columnId] });
    }
  } else {
    if (enabledIdx >= 0) {
      onChange({ enabledColumns: enabledColumns.filter(c => c !== columnId) });
    } else {
      onChange({ disabledColumns: [...disabledColumns, columnId] });
    }
  }
}
