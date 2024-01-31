// var appDataSources = [];

// Fliplet.DataSources.get({
//   appId: Fliplet.Env.get('masterAppId'),
//   attributes: ['id', 'name']
// }).then(function(dataSources) {
//   appDataSources = dataSources.map((el) => {
//     return { value: el.id, label: el.name };
//   });
Fliplet.Widget.generateInterface({
  title: 'File list',
  fields: [
    {
      name: 'dataSource',
      type: 'provider',
      label: 'Datasource',
      package: 'com.fliplet.data-source-provider',
      onEvent: function (event, data) {
        debugger;
        // var value = 'x';

        // Fliplet.Helper.field('columnName').toggle(value);

        // if (value) {
        //   Fliplet.DataSources.getById(value, {
        //     attributes: ['columns']
        //   }).then(function(columns) {
        //     $('#columnName').html('');
        //     columns.columns.forEach((el) => {
        //       $('#columnName').append(`<option value="${el}">${el}</option>`);
        //     });
        //   });
        // }
      },
      ready: function(el, value, provider) {
        debugger;
        // var valuex = Fliplet.Helper.field('dataSource').get();

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
    // {
    //   name: 'dataSource',
    //   type: 'dropdown',
    //   label: 'Data Source',
    //   options: appDataSources,
    //   default: '',
    //   change: function(value) {
    //     Fliplet.Helper.field('columnName').toggle(value);

    //     if (value) {
    //       Fliplet.DataSources.getById(value, {
    //         attributes: ['columns']
    //       }).then(function(columns) {
    //         $('#columnName').html('');
    //         columns.columns.forEach((el) => {
    //           $('#columnName').append(`<option value="${el}">${el}</option>`);
    //         });
    //       });
    //     }
    //   },
    //   ready: function() {
    //     var value = Fliplet.Helper.field('dataSource').get();

    //     if (value) {
    //       Fliplet.DataSources.getById(value, {
    //         attributes: ['columns']
    //       }).then(function(columns) {
    //         $('#columnName').html('');
    //         columns.columns.forEach((el) => {
    //           $('#columnName').append(`<option value="${el}">${el}</option>`);
    //         });
    //       });
    //     }
    //   }
    // },
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
// });
