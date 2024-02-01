document.addEventListener("DOMContentLoaded", function () {
    function createInlineEditor(element, type) {
        var rect = element.getBoundingClientRect();
        var top = rect.top + window.scrollY;
        var left = rect.left + window.scrollX;

        // Create inline editor container
        var editorContainer = document.createElement('div');
        editorContainer.classList.add('inline-editor');
        editorContainer.style.position = 'absolute';
        editorContainer.style.top = top + 'px';
        editorContainer.style.left = left + 'px';

        // Create input field for editing
        var inputField;
        if (type === 'text') {
            inputField = document.createElement('textarea');
            inputField.value = element.innerText;
            inputField.classList.add('border', 'rounded', 'p-2', 'resize-y', 'w-full', 'h-32');
        } else if (type === 'image') {
            inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = element.getAttribute('src');
            inputField.classList.add('border', 'rounded', 'p-2', 'w-full');
        }

        editorContainer.appendChild(inputField);

        // Create [x] button for cancel
        var cancelButton = document.createElement('button');
        cancelButton.classList.add('text-gray-500', 'rounded-full', 'px-1', 'py-1', 'absolute', 'top-2', 'right-2');
        cancelButton.innerHTML = '&#x2716;'; // Unicode for '✖'
        cancelButton.addEventListener('click', function () {
            editorContainer.remove();
        });
        editorContainer.appendChild(cancelButton);

        // Append editor container to the body
        document.body.appendChild(editorContainer);

        // Focus on the input field
        inputField.focus();

        // Add event listener for Enter key press to save changes
        inputField.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                saveChanges(element, inputField.value);
                editorContainer.remove();
            }
        });
    }

    function saveChanges(element, value) {
        if (element.tagName.toLowerCase() === 'img') {
            element.setAttribute('src', value);
        } else {
            element.innerText = value;
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
});
