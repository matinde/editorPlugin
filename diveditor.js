// Declare contextMenu as a global variable
var contextMenu;

// Function to add event listeners to a div element
function addEventListenersToDiv(divElement) {
    divElement.addEventListener('mouseover', function() {
        this.style.border = '2px solid purple';
        this.style.borderRadius = '5px';
    });
    divElement.addEventListener('mouseout', function() {
        this.style.border = '';
    });
}

// Add event listeners to all existing div elements
var divElements = document.querySelectorAll('div');
divElements.forEach(addEventListenersToDiv);

document.addEventListener('contextmenu', function(event) {
    var divElement = event.target.closest('div');
    if (divElement) {
        event.preventDefault();

        // Remove existing context menu if any
        if (contextMenu) {
            contextMenu.remove();
        }

        // Create context menu
        contextMenu = document.createElement('div');
        contextMenu.style.position = 'absolute';
        contextMenu.style.backgroundColor = '#f9f9f9f9';
        contextMenu.style.top = event.pageY + 'px'; // Use pageY instead of clientY
        contextMenu.style.left = event.pageX + 'px'; // Use pageX instead of clientX
        contextMenu.innerHTML = `
            <button style="display: block; margin: 10px; padding: 10px;" id="change-color">Change Background Color</button>
            <button style="display: block; margin: 10px; padding: 10px;" id="upload-image">Upload Background Image</button>
            <button style="display: block; margin: 10px; padding: 10px;" id="delete-div">Delete Element</button>
        `;
        document.body.appendChild(contextMenu);

        // Add event listener for delete button
        document.getElementById('delete-div').addEventListener('click', function() {
            divElement.remove();
            contextMenu.remove();
        });

        // Add event listener for change color button
        document.getElementById('change-color').addEventListener('click', function() {
            var colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.onchange = function() {
                divElement.style.backgroundColor = this.value;
                contextMenu.remove();
            };
            colorInput.click(); // Trigger the color picker
        });

        // Add event listener for upload image button
        document.getElementById('upload-image').addEventListener('click', function() {
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = function() {
                var file = this.files[0];
                if (file && file.size <= 5000000) { // 5MB
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        divElement.style.backgroundImage = 'url(' + e.target.result + ')';
                        divElement.style.backgroundSize = 'cover'; // Make the image fit the div
                        contextMenu.remove();
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select an image file less than 5MB.');
                }
            };
            fileInput.click(); // Trigger the file input
        });
    }
});

// Remove the context menu when clicking anywhere else
document.addEventListener('click', function() {
    if (contextMenu) {
        contextMenu.remove();
    }
});

// Assuming you have a drop zone with id 'drop-zone'
var dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('drop', function(event) {
    event.preventDefault();

    // Assuming the data transferred is the HTML of the new element
    var newElementHTML = event.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforeend', newElementHTML);

    var newElement = this.lastElementChild;
    addEventListenersToDiv(newElement);
});

dropZone.addEventListener('dragover', function(event) {
    event.preventDefault();
});