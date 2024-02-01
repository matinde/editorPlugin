document.addEventListener("DOMContentLoaded", function () {
  // Image Editing
  var imgElements = document.querySelectorAll('img');

  imgElements.forEach(function (img) {
      img.addEventListener('click', function () {
          var currentSrc = img.getAttribute('src');
          var filename = currentSrc.split('/').pop();

          // Create overlay
          var overlay = createOverlay();

          // Create dialog
          var dialog = createDialog();

          // Create image form
          var form = createImageForm(currentSrc, filename, img, overlay, dialog);

          // Append form to dialog
          dialog.appendChild(form);

          // Append overlay and dialog to the body
          document.body.appendChild(overlay);
          document.body.appendChild(dialog);
      });
  });

  // Text Editing
  var textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5');

  textElements.forEach(function (textElement) {
      textElement.addEventListener('click', function () {
          var currentText = textElement.innerText;

          // Create overlay
          var overlay = createOverlay();

          // Create dialog
          var dialog = createDialog();

          // Create text form
          var form = createTextForm(currentText, textElement, overlay, dialog);

          // Append form to dialog
          dialog.appendChild(form);

          // Append overlay and dialog to the body
          document.body.appendChild(overlay);
          document.body.appendChild(dialog);
      });
  });

  function createOverlay() {
      var overlay = document.createElement('div');
      overlay.id = 'overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '999';
      return overlay;
  }

  function createDialog() {
      var dialog = document.createElement('div');
      dialog.id = 'imagePopup';
      dialog.style.position = 'fixed';
      dialog.style.top = '50%';
      dialog.style.left = '50%';
      dialog.style.transform = 'translate(-50%, -50%)';
      dialog.style.zIndex = '1000';
      dialog.style.padding = '20px';
      dialog.style.border = '2px solid #fff';
      dialog.style.backgroundColor = '#fff';
      return dialog;
  }

  function createImageForm(currentSrc, filename, img, overlay, dialog) {
      var form = document.createElement('form');
      form.id = 'imageForm';
      form.classList.add('flex', 'flex-col', 'space-y-4');

      var labelUrl = document.createElement('label');
      labelUrl.for = 'newImageUrl';
      labelUrl.classList.add('font-bold');
      labelUrl.innerText = 'Enter the new image URL:';
      form.appendChild(labelUrl);

      var inputUrl = document.createElement('input');
      inputUrl.type = 'text';
      inputUrl.id = 'newImageUrl';
      inputUrl.value = currentSrc;
      inputUrl.classList.add('border', 'rounded', 'p-2');
      form.appendChild(inputUrl);

      form.appendChild(document.createElement('br'));

      var labelFile = document.createElement('label');
      labelFile.for = 'newImageFile';
      labelFile.classList.add('font-bold');
      labelFile.innerText = 'Upload a new image:';
      form.appendChild(labelFile);

      var inputImageFile = document.createElement('input');
      inputImageFile.type = 'file';
      inputImageFile.id = 'newImageFile';
      inputImageFile.classList.add('border', 'rounded', 'p-2');
      form.appendChild(inputImageFile);

      form.appendChild(document.createElement('br'));

      var submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.classList.add('bg-blue-500', 'text-white', 'rounded', 'px-4', 'py-2');
      submitButton.innerText = 'Save';
      form.appendChild(submitButton);

      // Create cancel button
      var cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.classList.add('bg-red-500', 'text-white', 'rounded', 'px-4', 'py-2', 'mt-2');
      cancelButton.innerText = 'Cancel';
      form.appendChild(cancelButton);

      form.addEventListener('submit', function (e) {
          e.preventDefault();

          var newSrc = inputUrl.value;

          if (newSrc) {
              var newImage = new Image();
              newImage.src = newSrc;

              newImage.onload = function () {
                  img.setAttribute('src', newSrc);
                  var newFilename = newSrc.split('/').pop();
                  img.setAttribute('data-filename', newFilename);

                  var imageLink = img.parentElement;
                  if (imageLink && imageLink.tagName === 'A') {
                      var linkHref = imageLink.getAttribute('href');
                      var newLinkHref = linkHref.replace(filename, newFilename);
                      imageLink.setAttribute('href', newLinkHref);
                  }

                  overlay.remove();
                  dialog.remove();
              };
          }
      });

      // Add cancel button event listener
      cancelButton.addEventListener('click', function () {
          overlay.remove();
          dialog.remove();
      });

      return form;
  }

  function createTextForm(currentText, textElement, overlay, dialog) {
    var form = document.createElement('form');
    form.id = 'textForm';
    form.classList.add('flex', 'flex-col', );

    var labelText = document.createElement('label');
    labelText.for = 'newTextContent';
    labelText.classList.add('font-bold');
    labelText.innerText = 'Enter the new text content:';
    form.appendChild(labelText);

    var inputText = document.createElement('textarea');
    inputText.id = 'newTextContent';
    inputText.value = currentText;
    inputText.style.border = '1px solid #ccc';
    inputText.style.borderRadius = '0.25rem';
    inputText.style.padding = '0.5rem';
    inputText.style.resize = 'vertical'; // Allow vertical resizing
    inputText.style.width = '200px'; // Set width to 100%
    inputText.style.minHeight = '200px'; // Set an initial height
    form.appendChild(inputText);

    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('bg-blue-500', 'text-white', 'rounded', 'px-4', 'py-2');
    submitButton.innerText = 'Save';
    form.appendChild(submitButton);

    // Create cancel button
    var cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.classList.add('bg-red-500', 'text-white', 'rounded', 'px-4', 'py-2', 'mt-2');
    cancelButton.innerText = 'Cancel';
    form.appendChild(cancelButton);


      form.addEventListener('submit', function (e) {
          e.preventDefault();

          var newText = inputText.value;

          if (newText) {
              textElement.innerText = newText;
              overlay.remove();
              dialog.remove();
          }
      });

      // Add cancel button event listener
      cancelButton.addEventListener('click', function () {
          overlay.remove();
          dialog.remove();
      });

      return form;
  }
});


