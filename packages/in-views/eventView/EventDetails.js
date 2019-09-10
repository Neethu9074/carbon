import React from 'react';

import locals from './EventDetails.mless';

export default function EventDetails({ eventId, openItem }) {
  return (
    <div className={locals.wrapper} onClick={() => openItem('42')}>
      hello! {eventId}
    </div>
  );
}

// function Header(props) {
//   return (
//     <Fragment>
//       <Breadcrumbs
//         items={[
//           <Breadcrumb label={`Analyze ${dataSourceTitles[props.beaconType]}s`} href$={closePageLoadViewLink} />,
//           props.pageLoadLabel && <Breadcrumb label="Page Load">{shorten(props.pageLoadLabel, 32)}</Breadcrumb>
//         ].filter(Boolean)}
//       />
//       <BasicDashboardHeader
//         title="Page Load"
//         icon="lib_website"
//         renderActions={Actions}
//         getLabel={getLabelForHeader}
//         {...props}
//       />
//     </Fragment>
//   );
// }

// function calculateLabel(result) {
//   if (!result || !result.data || result.data.length === 0) {
//     return null;
//   }

//   const page = get(result, ['data', 0, 'page']);
//   if (isNotBlank(page)) {
//     const origin = get(result, ['data', 0, 'locationOrigin']);
//     if (isNotBlank(origin)) {
//       return `${page} on ${origin}`;
//     }
//     return page;
//   } else {
//     return get(result, ['data', 0, 'locationUrl']);
//   }
// }

// function getLabelForHeader(result, { pageLoadLabel }) {
//   return pageLoadLabel;
// }

// function Actions({ pageLoadId, beaconTimestamp, pageLoadLabel }) {
//   return (
//     <Fragment>
//       {pageLoadLabel && (
//         <Button
//           icon="lib_actions_download"
//           kind="secondary"
//           target="_blank"
//           href={`/api/website-monitoring/page-load;id=${encodeURIComponent(pageLoadId)};timestamp=${encodeURIComponent(
//             beaconTimestamp
//           )}?pretty`}
//         >
//           Download
//         </Button>
//       )}

//       <Link href$={closePageLoadViewLink}>
//         <Tooltip content="Close page load details">
//           <SvgIcon aria-label="Close page load details" type="lib_openclose_cancel" />
//         </Tooltip>
//       </Link>
//     </Fragment>
//   );
// }
