export default function createStackedAreaContentRenderer() {
  return {
    requireExistenceInAllSeries: true,
    processNewDataColumns,
    render
  };

  function processNewDataColumns() {
    console.log('TODO processNewDataColumns stacked area');
  }


  function render() {
    console.log('TODO render stacked area');
  }
}
