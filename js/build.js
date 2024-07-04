// TODO missing icon
Fliplet.Widget.instance({
  name: 'file-image-list',
  displayName: 'File or image list',
  icon: 'fa-exchange',
  render: {
    dependencies: [],
    template: [
      '<div data-view="content" class="configured"></div>',
      `<div data-view="not-configured" class="not-configured">
        <p>Configure File & Image list component</p>
      </div>`,
      '<div data-view="configured-interact" class="configured-interact"></div>'
    ].join(''),
    ready: async function() {
      let fileList = this;
      const entry = fileList?.parent?.entry || {};
      const fileListInstanceId = fileList.id;
      const modeInteract = Fliplet.Env.get('interact');

      function showContent(mode) {
        $('.configured').toggle(mode === 'configured');
        $('.not-configured').toggle(mode === 'not-configured');
        $('.configured-interact').toggle(mode === 'configured-interact');

        switch (mode) {
          case 'configured-interact':
            $('.configured-interact').html(`<div class="file-container">
              <div class="file-container-item">
                <div>
                  <p>Title</p>
                  <p>Uploaded: ${moment(new Date()).format('MMM D, YYYY')} - 12KB</p>
                </div>
                <div>
                  <i class="fa fa-2x fa-angle-right" aria-hidden="true"></i>
                </div>
                </div>
              </div>
              <div class="file-container-item">
                <div>
                  <p>Title</p>
                  <p>Uploaded: ${moment(new Date()).format('MMM D, YYYY')} - 12KB</p>
                </div>
                <div>
                  <i class="fa fa-2x fa-angle-right" aria-hidden="true"></i>
                </div>
                </div>
              </div>`);
            break;

          default:
            break;
        }
      }

      return Fliplet.Widget.findParents({ instanceId: fileListInstanceId }).then(widgets => {
        let dynamicContainer = null;
        let recordContainer = null;
        let listRepeater = null;

        widgets.forEach((widget) => {
          if (widget.package === 'com.fliplet.dynamic-container') {
            dynamicContainer = widget;
          } else if (widget.package === 'com.fliplet.record-container') {
            recordContainer = widget;
          } else if (widget.package === 'com.fliplet.list-repeater') {
            listRepeater = widget;
          }
        });

        if (
          !dynamicContainer
            || !dynamicContainer.dataSourceId
            || (!recordContainer && !listRepeater)
        ) {
          showContent('not-configured');

          return;
        }

        const dataSourceId = dynamicContainer.dataSourceId;
        const dataSourceEntryId = entry.id;

        const populateFileList = () => {
          let columnName = fileList.fields.columnName;
          let type = fileList.fields.type;

          if (!navigator.onLine) {
            return Fliplet.UI.Toast('Please connect device to the internet');
          } else if (!dataSourceEntryId && !modeInteract) {
            return Fliplet.UI.Toast(
              'Missing dataSourceEntryId as a query parameter'
            );
          } else if (!dataSourceId && !modeInteract) {
            return Fliplet.UI.Toast(
              'Please select Data Source from the File list component configuration'
            );
          } else if (!columnName) {
            showContent('not-configured');

            return Fliplet.UI.Toast(
              'Please select Column Name from File list component configuration'
            );
          } else if (!type) {
            showContent('not-configured');

            return Fliplet.UI.Toast(
              'Please select Type from File list component configuration'
            );
          } else if (modeInteract) {
            showContent('configured-interact');

            return;
          }

          if (!isArray(entry.data[columnName])) {
            $(document)
              .find('[data-helper="file-image-list"]')
              .html('<p class="style-title">ATTACHMENTS</p>');

            return;
          }

          showContent('configured');

          let fileIDs = entry.data[columnName].map(function(file) {
            let url = typeof file === 'string' ? file : file.url;

            return Fliplet.Media.getIdFromRemoteUrl(url);
          });

          // TODO check how to escape this call - product will provide solution
          Fliplet.Media.Files.getAll({
            files: fileIDs,
            fields: ['name', 'url', 'metadata', 'createdAt']
          }).then(files => {
            let filesInfo = files
              .map(function(file) {
                const extension = file.name
                  .split('.')
                  .pop()
                  .toLowerCase();
                let type = '';

                switch (extension) {
                  case 'jpg':
                  case 'jpeg':
                  case 'png':
                  case 'gif':
                    type = 'image';
                    break;
                  case 'mp4':
                  case 'avi':
                  case 'mkv':
                  case 'mov':
                    type = 'video';
                    break;
                  default:
                    type = 'file';
                    break;
                }

                return {
                  type,
                  name: file.name,
                  size: file.metadata.size,
                  uploaded: file.createdAt,
                  url: file.url
                };
              })
              .sort(sortFilesByName);

            if (type === 'Image') {
              let data = {
                images: filesInfo.map((el) => {
                  return {
                    // title: el.name,
                    url: Fliplet.Media.authenticate(el.url)
                  };
                }),
                options: {
                  index: 0,
                  errorMsg: 'The photo cannot be loaded'
                }
              };
              let images = data.images.map((el, index) => {
                return `<div class="image-item-container" 
                              data-index="${index}">
                              <img src="${el.url}" />
                            </div>`;
              });

              $(document)
                .find('[data-helper="file-image-list"]')
                .html('<p>ATTACHMENTS</p></hr>');

              $(document).find('[data-helper="file-image-list"]').append(`
                    <div class="image-container">
                      ${images.join('')}
                    <div>
                  `);

              $(document)
                .find('.image-item-container')
                .off('click')
                .on('click', function() {
                  data.options.index = Number($(this).attr('data-index'));
                  Fliplet.Navigate.previewImages(data);
                });
            } else {
              let str = '';
              let fileItems = [];

              filesInfo.forEach((el) => {
                fileItems.push(`<div class="file-container-item" data-link="${encodeURIComponent(
                  el.url
                )}">
                    <div>
                      <p>${el.name}</p>
                      <p>Uploaded: ${moment(el.uploaded).format(
    'MMM D, YYYY'
  )} - ${convertBytesToLargerUnits(el.size)}</p>
                    </div>
                    <div>
                      <i class="fa fa-2x fa-angle-right" aria-hidden="true"></i>
                    </div>
                    </div>`);
              });

              str += `<div class="file-container">${fileItems.join(
                ''
              )}</div>`;
              $(document).find('[data-helper="file-image-list"]').append(str);

              $(document)
                .find('.file-container-item')
                .off('click')
                .on('click', function() {
                  let link = decodeURIComponent(
                    $(this).attr('data-link')
                  );

                  window.open(Fliplet.Media.authenticate(link), '_blank');
                });
            }
          });
        };

        function isArray(array) {
          return array && Array.isArray(array);
        }

        function sortFilesByName(a, b) {
          let aFileName = a.name.toUpperCase();
          let bFileName = b.name.toUpperCase();

          if (aFileName < bFileName) {
            return -1;
          }

          if (aFileName > bFileName) {
            return 1;
          }

          return 0;
        }

        function convertBytesToLargerUnits(bytes) {
          const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          let unitIndex = 0;

          while (bytes >= 1024 && unitIndex < units.length - 1) {
            bytes /= 1024;
            unitIndex++;
          }

          return `${bytes.toFixed(2)} ${units[unitIndex]}`;
        }

        return populateFileList();
      });
    },
    views: [
      {
        name: 'content',
        displayName: 'File list content',
        placeholder: '<p>Configure File & Image list component</p>'
      }
    ]
  }
});
