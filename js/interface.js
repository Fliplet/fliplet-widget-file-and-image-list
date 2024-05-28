Fliplet.Widget.findParents({ filter: { package: 'com.fliplet.dynamic-container' } }).then(function(widgets) {
  const dynamicContainer = widgets[0];

  return Fliplet.DataSources.getById(dynamicContainer && dynamicContainer.dataSourceId, {
    attributes: ['columns']
  }).then((dataSource) => {
    return _.orderBy(dataSource.columns, column => column.toLowerCase());
  }, () => {
    return [];
  }).then((dataSourceColumns = []) => {
    return Fliplet.Widget.generateInterface({
      title: 'File list',
      fields: [
        {
          name: 'columnName',
          type: 'dropdown',
          label: 'Pick file column',
          options: dataSourceColumns,
          default: '',
          ready: function() {

          }
        },
        {
          name: 'type',
          type: 'dropdown',
          label: 'Type',
          options: ['Image', 'File'],
          default: 'Image'
        }
      ]
    });
  });
});
