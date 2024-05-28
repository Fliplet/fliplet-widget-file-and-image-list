Fliplet.Widget.generateInterface({
  title: 'File list',
  fields: [
    {
      name: 'dataSource',
      type: 'provider',
      label: 'Datasource',
      package: 'com.fliplet.data-source-provider',
      onEvent: function(event, data) {
        if (event === 'dataSourceSelect') {
          Fliplet.Helper.field('columnName').toggle(data.name);

          $('#columnName').html('');
          data.columns.forEach((el) => {
            $('#columnName').append(`<option value="${el}">${el}</option>`);
          });
        }
      },
      ready: function(el, value) {
        if (value) {
          Fliplet.DataSources.getById(value.id, {
            attributes: ['columns']
          }).then(function(columns) {
            $('#columnName').html('');
            columns.columns.forEach((el) => {
              $('#columnName').append(`<option value="${el}">${el}</option>`);
            });
          });
        }
      }
    },
    {
      name: 'columnName',
      type: 'dropdown',
      label: 'Pick file column',
      options: [],
      default: '',
      ready: function() {
        Fliplet.Helper.field('columnName').toggle(
          Fliplet.Helper.field('dataSource').get()
        );
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
