/**
* Creates a formatted, user-friendly text input over an existing number input
* without requiring manual HTML changes.
*
* How it works:
* 1. Finds all inputs with `data-type="easy-number-separator"`.
* 2. For each one, it creates a new `input[type=text]` for display.
* 3. It hides the original `input[type=number]` but keeps it functional for form submission.
* 4. It synchronizes the values between the two inputs automatically.
*
* @param {object} [config] - Optional configuration.
* @param {string} [config.separator=','] - The character for the thousand separator.
* @param {string} [config.decimalSeparator='.'] - The character for the decimal point.
*/
function easyNumberSeparator(config) {
    // ## 1. Configuration and Setup ##
    const conf = {
        separator: (config && config.separator) || ',',
        decimalSeparator: (config && config.decimalSeparator) || '.',
    };

    // Regular expression to find all non-numeric characters except the decimal separator
    const stripRegex = new RegExp(`[^0-9\\${conf.decimalSeparator}]`, 'g');

    /**
     * Formats a raw number string into a currency-style string.
     * e.g., "12345.67" -> "12,345.67"
     */
    function format(rawStr) {
        if (!rawStr) return '';
        let [integerPart, decimalPart] = rawStr.split(conf.decimalSeparator);
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, conf.separator);
        return decimalPart !== undefined
            ? `${integerPart}${conf.decimalSeparator}${decimalPart}`
            : integerPart;
    }

    /**
     * Strips all formatting to get a clean number string.
     * e.g., "12,345.67" -> "12345.67"
     */
    function unformat(formattedStr) {
        return formattedStr.replace(stripRegex, '');
    }

    // ## 2. The Transformation Logic ##
    function transformInput(originalInput) {
        // Prevent re-initializing the same input
        if (originalInput.dataset.isSeparated) return;
        originalInput.dataset.isSeparated = 'true';

        // Create the visible input for the user
        const displayInput = document.createElement('input');
        displayInput.setAttribute('type', 'text');
        displayInput.setAttribute('inputmode', 'decimal'); // Shows numeric keyboard on mobile

        // Copy essential attributes from the original input
        ['class', 'id', 'placeholder', 'required'].forEach(attr => {
            if (originalInput.hasAttribute(attr)) {
                displayInput.setAttribute(attr, originalInput.getAttribute(attr));
            }
        });

        // Style the inputs to create the illusion
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block'; // Or 'block' depending on context

        // Hide original input visually but keep it functional
        originalInput.style.position = 'absolute';
        originalInput.style.opacity = '0';
        originalInput.style.top = '0';
        originalInput.style.left = '0';
        originalInput.style.width = '100%';
        originalInput.style.height = '100%';
        originalInput.style.pointerEvents = 'none'; // Prevents interaction

        // Replace the original input with the wrapper containing both inputs
        originalInput.parentNode.insertBefore(wrapper, originalInput);
        wrapper.appendChild(displayInput);
        wrapper.appendChild(originalInput);

        // Set the initial value from the original input
        displayInput.value = format(originalInput.value);

        // ## 3. Synchronization ##

        // When user types in the display input...
        displayInput.addEventListener('input', () => {
            const rawValue = unformat(displayInput.value);
            const formattedValue = format(rawValue);

            // Update the hidden original input's value for form submission
            originalInput.value = rawValue;

            // Update the displayed value with formatting
            displayInput.value = formattedValue;
        });

        // When the display input loses focus, ensure it's a valid number
        displayInput.addEventListener('blur', () => {
            // On blur, if the input is just a separator, clear it.
            if (displayInput.value === conf.decimalSeparator) {
                displayInput.value = '';
                originalInput.value = '';
            }
        });
    }

    // ## 4. Initialize all target inputs on the page ##
    document
        .querySelectorAll('input[data-type="currency"]')
        .forEach(transformInput);
}

easyNumberSeparator();