const groups = {
  name: {
    label: 'Trace Name',
    technicalName: 'trace.name'
  }
};
export default groups;

export function getGroupByTechnicalName(technicalName) {
  const keys = Object.keys(groups);
  for (let i = 0; i < keys.length; i++) {
    const group = groups[keys[i]];
    if (group.technicalName === technicalName) {
      return group;
    }
  }
}
