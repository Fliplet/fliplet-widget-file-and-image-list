Fliplet.Widget.findParents({ filter: { package: 'com.fliplet.dynamic-container' } }).then(function(widgets) {
  const dynamicContainer = widgets[0];

  if (widgets.length === 0 || !dynamicContainer.dataSourceId) {
    Fliplet.Widget.generateInterface({
      title: 'Configure data files',
      fields: [
        {
          type: 'html',
          html: '<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">This component needs to be placed inside a Data container with selected Data source</p>'
        }
      ]
    });

    return Fliplet.UI.Toast('This component needs to be placed inside a Data container with selected Data source');
  }


  return Fliplet.DataSources.getById(dynamicContainer.dataSourceId, {
    attributes: ['columns']
  }).then((dataSource) => {
    return Fliplet.Utils.orderBy(dataSource.columns, column => column.toLowerCase());
  }, () => {
    return [];
  }).then((dataSourceColumns = []) => {
    return Fliplet.Widget.generateInterface({
      title: 'File list',
      fields: [
        {
          name: 'columnName',
          type: 'dropdown',
          label: 'Pick File or Image column',
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
