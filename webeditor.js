
var snippets = [
    {
        title: 'Single Column',
        html: `<section class="my-section  justify-between m-5">
        <div class="my-layout bg-gray-200 p-4">
            <h2 class="text-xl font-bold mb-2">Headline 1</h2>
            <p class="text-gray-700">This is some dummy text for column 1.</p>
        </div>
        </section>`
    },
    {
        title: '2-Column',
        html: `<section class="my-section  justify-between m-5">
        <div class="my-layout flex justify-between">
            <div class="bg-gray-200 p-4 w-1/2 mr-2">
                <h2 class="text-xl font-bold mb-2">Headline 1</h2>
                <p class="text-gray-700">This is some dummy text for column 1.</p>
            </div>
            <div class="bg-gray-200 p-4 w-1/2 ml-2">
                <h2 class="text-xl font-bold mb-2">Headline 2</h2>
                <p class="text-gray-700">This is some dummy text for column 2.</p>
            </div>
        </div>
        </section>`
    },
    {
        title: '3-Column',
        html: `<section class="my-section flex justify-between m-5">
            <div class="bg-gray-200 p-4 w-1/3 mr-2">
                <h2 class="text-xl font-bold mb-2">Headline 1</h2>
                <p class="text-gray-700">This is some dummy text for column 1.</p>
            </div>
            <div class="bg-gray-200 p-4 w-1/3 mx-2">
                <h2 class="text-xl font-bold mb-2">Headline 2</h2>
                <p class="text-gray-700">This is some dummy text for column 2.</p>
            </div>
            <div class="bg-gray-200 p-4 w-1/3 ml-2">
                <h2 class="text-xl font-bold mb-2">Headline 3</h2>
                <p class="text-gray-700">This is some dummy text for column 3.</p>
            </div>
        </section>`
    },
   
];

// Create a div for the editor
var editor = document.createElement('div');
editor.style.position = 'fixed';
editor.style.right = '0';
editor.style.top = '0';
editor.style.width = '0';
editor.style.height = '100vh';
editor.style.backgroundColor = '#f9f9f9';
editor.style.borderLeft = '1px solid #000';
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
['Header', 'Layout'].forEach(function(section) {
    var button = document.createElement('button');
    button.textContent = section;
    button.style.width = '100%';
    button.style.backgroundColor = '#f9f9f9';
    button.style.border = '1px solid #000';
    editor.appendChild(button);

    // Create a div for the section content
    var content = document.createElement('div');
    content.style.display = 'none'; // Initially hide the content
    content.style.border = '1px solid #000';
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

// Create a drop zone
var dropZone = document.createElement('div');
dropZone.id = 'drop-zone';
dropZone.addEventListener('dragover', function(event) {
    event.preventDefault(); // Prevent default to allow drop
});
dropZone.addEventListener('drop', function(event) {
    event.preventDefault(); // Prevent default action (open as link for some elements)
    var data = event.dataTransfer.getData('text/plain');
    dropZone.innerHTML += data;
});
document.body.appendChild(dropZone);

// Below creates the drop zone for the editor
var dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', function(event) {
    event.preventDefault(); // Prevent default to allow drop
});

dropZone.addEventListener('drop', function(event) {
    event.preventDefault(); // Prevent default action (open as link for some elements)
    var data = event.dataTransfer.getData('text/plain');
    dropZone.innerHTML += data;
});