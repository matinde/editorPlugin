async function loadSnippets(section) {
    try {
        const response = await fetch(`./snippets/${section}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const snippets = await response.json();
        return snippets;
    } catch (error) {
        console.error(`There was an error with the fetch operation for ${section}:`, error);
        return []; // return an empty array when an error occurs
    }
}

/// Define the sections to load
const sections = ['headers', 'texts', 'images', 'lists']; // replace with your actual sections

// Load all sections
Promise.all(sections.map(section => loadSnippets(section)))
    .then(results => {
        // Create a div for the editor
        var editor = document.createElement('div');
        editor.style.position = 'fixed';
        editor.style.right = '0';
        editor.style.top = '0';
        editor.style.width = '0';
        editor.style.height = '100vh';
        editor.style.backgroundColor = '#f9f9f9';
        editor.style.borderLeft = '1px solid lightgrey';
        editor.style.overflowX = 'hidden';
        editor.style.transition = '0.5s'; // Add transition for sliding effect
        document.body.appendChild(editor);

        // Show the editor when the cursor is at the extreme right
        document.body.addEventListener('mousemove', function(event) {
            if (window.innerWidth - event.clientX < 50) { // Change this value to adjust the sensitivity
                editor.style.width = '300px'; // Change this value to adjust the width of the editor
            } else if (window.innerWidth - event.clientX > 400) { // Change this value to adjust when the editor should close
                editor.style.width = '0';
            }
        });

        // Create a button for each section
        results.forEach((snippets, index) => {
            var section = sections[index];
            var button = document.createElement('button');
            button.textContent = section;
            button.style.width = '90%';
            button.style.margin = '10px';
            button.style.backgroundColor = 'purple';
            button.style.color = 'white';
            button.style.border = '1px solid grey';
            button.classList.add('btn');
            editor.appendChild(button);

            // Create a div for the section content
            var content = document.createElement('div');
            content.style.display = 'none'; // Initially hide the content
            content.style.border = '1px solid lightgrey';
            content.style.padding = '10px';
            editor.appendChild(content);

            // Show or hide the content when the button is clicked
            button.addEventListener('click', function() {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            });
            // Add your template snippets to the content
            snippets.forEach(function(snippet, index) {
                var div = document.createElement('div');
                div.draggable = true;
                div.textContent = snippet.title;
                div.id = 'snippet-' + index;
                div.style.border = '1px solid #000';
                div.style.padding = '10px';
                div.style.margin = '10px';
                div.style.flexBasis = '30%'; // Each div will take up approximately 30% of the content width
                div.style.textAlign = 'center'; // Center the text
                div.style.backgroundColor = '#f9f9f9'; // Add a background color
                div.style.borderRadius = '5px'; // Add rounded corners
                div.addEventListener('dragstart', function(event) {
                    event.dataTransfer.setData('text/plain', snippet.html);
                });
                content.appendChild(div);
            });
        });

        // Make elements draggable
        var draggables = document.querySelectorAll('.draggable');
        draggables.forEach(function(draggable) {
            draggable.setAttribute('draggable', 'true');
            draggable.addEventListener('dragstart', function(event) {
                event.dataTransfer.setData('text/plain', draggable.innerHTML);
            });
        });

        // Set up drop zone
        var dropZone = document.getElementById('drop-zone');
        dropZone.addEventListener('dragover', function(event) {
            event.preventDefault(); // Prevent default to allow drop
        });
        dropZone.addEventListener('drop', function(event) {
            event.preventDefault(); // Prevent default action (open as link for some elements)
            var data = event.dataTransfer.getData('text/plain');

            // Create a new div to hold the dropped content
            var newDiv = document.createElement('div');
            newDiv.innerHTML = data;

            // Get the nearest element to the drop position
            var nearestElement = document.elementFromPoint(event.clientX, event.clientY);

            // Get the relative position of the cursor within the nearest element
            var relativeY = event.clientY - nearestElement.getBoundingClientRect().top;

            if (relativeY < nearestElement.offsetHeight / 3) {
                // If the cursor is near the top edge, insert before
                nearestElement.parentNode.insertBefore(newDiv, nearestElement);
            } else if (relativeY > 2 * nearestElement.offsetHeight / 3) {
                // If the cursor is near the bottom edge, insert after
                nearestElement.parentNode.insertBefore(newDiv, nearestElement.nextSibling);
            } else {
                // If the cursor is not near any edge, replace
                nearestElement.parentNode.replaceChild(newDiv, nearestElement);
            }
        });

    // Create a div for the buttons
    var buttonContainer = document.createElement('div');
    buttonContainer.style.width = '100%';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.backgroundColor = 'bg-sky-900';
    editor.insertBefore(buttonContainer, editor.firstChild);

    // Create the Save button
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.width = '45%';
    saveButton.style.margin = '10px';
    saveButton.style.backgroundColor = 'blue';
    saveButton.style.borderRadius = '2px';
    saveButton.style.color = 'white';
    saveButton.classList.add('btn');
    buttonContainer.appendChild(saveButton);

    // Create the Download button
    var downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.style.width = '45%';
    downloadButton.style.margin = '10px';
    downloadButton.style.backgroundColor = 'orange';
    downloadButton.style.borderRadius = '2px';
    downloadButton.style.color = 'white';
    downloadButton.classList.add('btn');
    buttonContainer.appendChild(downloadButton);
});