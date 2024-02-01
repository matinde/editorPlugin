import cv2
import numpy as np

def change_logo_colors_with_overlap_outline(input_path, output_path):
    # Read the image with alpha channel
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)

    if img is None:
        print("Failed to load image")
        return

    # Convert BGR to RGB channel order
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Create a copy of the original image
    result = np.copy(img)

    # Find pixels that are white in the RGB channels (excluding alpha)
    white_pixels = np.all(result[:, :, :3] == [255, 255, 255], axis=-1)

    # Find pixels that are whitesmoke in the RGB channels (excluding alpha)
    whitesmoke_pixels = np.all(result[:, :, :3] == [245, 245, 245], axis=-1)

    # Set the RGB channels of white pixels to white (255) and alpha channel to 0 (transparent)
    result[:, :, :3][white_pixels] = 255
    result[:, :, 3][white_pixels] = 0

    # Threshold image to separate foreground and background
    _, thresh = cv2.threshold(result[:, :, :3].max(axis=2), 0, 255, cv2.THRESH_OTSU)

    # Find connected components
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(thresh)

    # Get the size of each connected component
    component_sizes = stats[:, cv2.CC_STAT_AREA]

    # Filter out background component (0)
    component_sizes = component_sizes[1:]

    # Find the label of the largest connected component
    largest_component_label = np.argmax(component_sizes) + 1

    # Create a mask for the largest connected component
    largest_component_mask = np.zeros_like(labels, dtype=np.uint8)
    largest_component_mask[labels == largest_component_label] = 255

    # Dilate the largest connected component mask to create an outline
    outline = cv2.dilate(largest_component_mask, None)

    # Set the RGB channels of non-whitesmoke pixels and outlined pixels to grey (128)
    result[:, :, :3][~white_pixels & outline.astype(bool)] = 128

    # Save the result to the output path
    cv2.imwrite(output_path, result)
    print("Image processed and saved successfully!")

# Example usage
change_logo_colors_with_overlap_outline('mastercard.png', 'logo_with_overlap_outline.png')






"""

# Now this code works well invesly changing white to transparent and non white to white.

import cv2
import numpy as np

def change_logo_colors_to_white_and_transparent(input_path, output_path):
    # Read the image with alpha channel
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)

    # Create a copy of the original image
    result = np.copy(img)

    # Find pixels that are white in the RGB channels (excluding alpha)
    white_pixels = np.all(result[:, :, :3] == [255, 255, 255], axis=-1)

    # Set the RGB channels of non-white pixels to white (255)
    result[:, :, :3][~white_pixels] = 255

    # Set the alpha channel of white pixels to 0 (transparent)
    result[:, :, 3][white_pixels] = 0

    # Save the result to the output path
    cv2.imwrite(output_path, result)

# Example usage
change_logo_colors_to_white_and_transparent('mastercard.png', 'logo_with_white_transparent_colors5.png')





import cv2
import numpy as np

def test_logo_contains_white(input_path):
    # Read the image
    img = cv2.imread(input_path)

    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Create a thresholded image to isolate white pixels
    _, thresholded = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)

    # Count the number of white pixels in the thresholded image
    white_pixels = cv2.countNonZero(thresholded)

    # Determine if the logo contains white based on the count of white pixels
    contains_white = white_pixels > 0

    return contains_white


# Example usage
contains_white = test_logo_contains_white('addidas.png')
print(contains_white)



import cv2
import numpy as np

def change_logo_colors_to_white(input_path, output_path):
    # Read the image with alpha channel
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)

    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Threshold the grayscale image to create a binary mask
    _, mask = cv2.threshold(gray, 1, 255, cv2.THRESH_BINARY)

    # Invert the mask to select the background pixels
    inverted_mask = cv2.bitwise_not(mask)

    # Create a copy of the original image
    result = np.copy(img)

    # Set the color channels of the background pixels to white (255)
    result[inverted_mask > 0] = 255

    # Save the result to the output path
    cv2.imwrite(output_path, result)


# Example usage
change_logo_colors_to_white('spotify.png', 'logo_with_white_colors1.png')




import cv2
import numpy as np

def change_logo_colors_to_white(input_path, output_path):
    # Read the image with alpha channel
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)

    # Create a copy of the original image
    result = np.copy(img)

    # Set the RGB channels of non-transparent pixels to white (255)
    result[:, :, :3][img[:, :, 3] > 0] = 255

    # Save the result to the output path
    cv2.imwrite(output_path, result)


# Example usage
change_logo_colors_to_white('starbucks.png', 'logo_with_white_colors.png')
"""