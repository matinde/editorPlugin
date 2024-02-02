// Declare editorContainer as a global variable
var editorContainer;

document.addEventListener("DOMContentLoaded", function () {
    function createInlineEditor(element, type) {
        // Create inline editor container
        editorContainer = document.createElement('div');
        editorContainer.classList.add('inline-editor');
        editorContainer.style.position = 'absolute';
        editorContainer.style.backgroundColor = '#f9f9f9'; // Set your desired background color

        // Calculate the position and width relative to the clicked element
        var rect = element.getBoundingClientRect();
        editorContainer.style.top = rect.top + window.scrollY + 'px';
        editorContainer.style.left = rect.left + window.scrollX + 'px';
        editorContainer.style.width = rect.width + 'px';

        // Create style tools container
        var styleToolsContainer = document.createElement('div');
        styleToolsContainer.classList.add('style-tools');
        styleToolsContainer.innerHTML = `
            <label>Font Size:</label>
            <input type="number" class="font-size-input" value="${getComputedStyle(element).fontSize.replace('px', '')}">
            <label>Font Color:</label>
            <input type="color" class="font-color-input" value="${rgbToHex(getComputedStyle(element).color)}">
            <label>Font Style:</label>
            <select class="font-style-select">
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                <option value="oblique">Oblique</option>
            </select>
            <label>Font Align:</label>
            <select class="font-align-select">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>
        `;
        editorContainer.appendChild(styleToolsContainer);

        // Create input field for editing
        var inputField;
        if (type === 'text') {
            inputField = document.createElement('textarea');
            inputField.value = element.innerText;
            inputField.classList.add('border', 'rounded', 'p-2', 'resize-y', 'w-full');
        } else if (type === 'image') {
            inputField = document.createElement('div');
            inputField.innerHTML = `
                <label for="image-upload" class="upload-label">Upload Image:</label>
                <input type="file" id="image-upload" accept="image/*" class="image-upload">
                <img src="${element.getAttribute('src')}" alt="Uploaded Image" class="uploaded-image" style="max-width: 100%;">
            `;
            inputField.classList.add('border', 'rounded', 'p-2', 'w-full', 'text-center');
        }

        editorContainer.appendChild(inputField);

        // Create [x] button for cancel
        var cancelButton = document.createElement('button');
        cancelButton.classList.add('text-gray-500', 'rounded-full', 'px-1', 'py-1', 'absolute', 'top-0', 'right-0');
        cancelButton.innerHTML = '&#x2716;'; // Unicode for '✖'
        cancelButton.style.transform = 'translate(100%, -100%)'; // Adjusted position
        cancelButton.addEventListener('click', function () {
            editorContainer.classList.remove('active');
        });
        editorContainer.appendChild(cancelButton);

        // Append editor container to the body
        document.body.appendChild(editorContainer);

        // Apply fade-in effect
        setTimeout(function () {
            editorContainer.classList.add('active');
        }, 10);

        // Focus on the input field
        if (type === 'text') {
            inputField.focus();
        }

        // Add event listener for Enter key press to save changes
        inputField.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                saveChanges(element, inputField, type);
            }
        });

        // Add event listeners for style tools
        styleToolsContainer.querySelector('.font-size-input').addEventListener('input', function (event) {
            element.style.fontSize = event.target.value + 'px';
        });

        styleToolsContainer.querySelector('.font-color-input').addEventListener('input', function (event) {
            element.style.color = event.target.value;
        });

        styleToolsContainer.querySelector('.font-style-select').addEventListener('change', function (event) {
            element.style.fontStyle = event.target.value;
        });

        styleToolsContainer.querySelector('.font-align-select').addEventListener('change', function (event) {
            element.style.textAlign = event.target.value;
        });

        // Add event listener for image upload
        if (type === 'image') {
            var imageUploadInput = inputField.querySelector('.image-upload');

            imageUploadInput.addEventListener('change', function (event) {
                handleImageUpload(event, inputField, element);
            });
        }
    }

    function saveChanges(element, inputField, type) {
        if (type === 'image') {
            handleImageUpload(null, inputField, element);
        } else {
            element.innerText = inputField.value;
        }

        // Apply fade-out effect
        editorContainer.classList.remove('active');
        setTimeout(function () {
            editorContainer.remove();
        }, 300); // Adjust this timeout to match the transition duration in CSS
    }

    function handleImageUpload(event, inputField, element) {
        var file = event ? event.target.files[0] : null;
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var uploadedImage = inputField.querySelector('.uploaded-image');
                uploadedImage.src = e.target.result;
                element.setAttribute('src', uploadedImage.src);

                // Apply fade-out effect after the image is set
                editorContainer.classList.remove('active');
                setTimeout(function () {
                    editorContainer.remove();
                }, 300); // Adjust this timeout to match the transition duration in CSS
            };
            reader.readAsDataURL(file);
        }
    }

    // Text Editing
    var textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5');

    textElements.forEach(function (textElement) {
        textElement.addEventListener('click', function () {
            createInlineEditor(textElement, 'text');
        });
    });

    // Image Editing
    var imgElements = document.querySelectorAll('img');

    imgElements.forEach(function (img) {
        img.addEventListener('click', function () {
            createInlineEditor(img, 'image');
        });
    });

    // Utility function to convert rgb to hex
    function rgbToHex(rgb) {
        var hex = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + ("0" + parseInt(hex[1], 10).toString(16)).slice(-2) +
                      ("0" + parseInt(hex[2], 10).toString(16)).slice(-2) +
                      ("0" + parseInt(hex[3], 10).toString(16)).slice(-2);
    }
});