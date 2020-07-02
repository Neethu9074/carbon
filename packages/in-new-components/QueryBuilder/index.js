import React from 'react';

import isFormModelValid from 'in-new-components/QueryBuilder/validation/formModel';
import { enrichTagCatalog } from 'in-new-components/QueryBuilder/tagCatalog';
import QueryBuilder from 'in-new-components/QueryBuilder/QueryBuilder';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { success } from 'in-services/util/result';

export function createQueryBuilder({ getTagCatalog: originalGetTagCatalog }) {
  // Ensure that we only ever receive the tag catalog once.
  const getTagCatalog = memoize(
    () =>
      originalGetTagCatalog().map(result => {
        if (result.data) {
          return success(enrichTagCatalog(result.data));
        }
        return result;
      }),
    () => '',
    Number.MAX_VALUE
  );

  return {
    QueryBuilder: function CreatedQueryBuilder(props) {
      return <QueryBuilder {...props} getTagCatalog={getTagCatalog} />;
    },

    isQueryValid: formModel =>
      getTagCatalog().map(result => {
        if (!result.data) {
          return result;
        }
        return success(isFormModelValid({ tagCatalog: result.data, formModel }));
      })
  };
}
