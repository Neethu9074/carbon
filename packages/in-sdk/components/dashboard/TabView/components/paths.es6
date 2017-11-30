export function compareTabsForRoutingPreference(nav1, nav2) {
  if (nav1.path.length > nav2.path.length) {
    return -1;
  } else if (nav1.path.length < nav2.path.length) {
    return 1;
  } else {
    return 0;
  }
}
