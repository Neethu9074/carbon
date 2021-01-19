/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useTagCatalog(getTagCatalog) {
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(() => getTagCatalog({ timeConfig }), [getTagCatalog, timeConfig]);
  return tagCatalogResult?.data;
}
