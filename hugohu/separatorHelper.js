/**
 * Creates a formatted text input over an existing number input,
 * preserving all original CSS styles and ensuring unique element IDs.
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

  const stripRegex = new RegExp(`[^0-9\\${conf.decimalSeparator}]`, 'g');

  function format(rawStr) {
    if (!rawStr) return '';
    let [integerPart, decimalPart] = rawStr.split(conf.decimalSeparator);
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, conf.separator);
    return decimalPart !== undefined ? `${integerPart}${conf.decimalSeparator}${decimalPart}` : integerPart;
  }

  function unformat(formattedStr) {
    return formattedStr.replace(stripRegex, '');
  }

  // ## 2. The Transformation Logic ##
  function transformInput(originalInput) {
    if (originalInput.dataset.isSeparated) return;
    originalInput.dataset.isSeparated = 'true';
    
    const originalStyles = window.getComputedStyle(originalInput);

    const displayInput = document.createElement('input');
    displayInput.setAttribute('type', 'text');
    displayInput.setAttribute('inputmode', 'decimal');
    
    // --- ID and Attribute Handling ---
    // Handle the ID separately to avoid duplicates.
    if (originalInput.id) {
      // Assign a new, unique ID to the now-hidden original input.
      displayInput.id = `${originalInput.id}-easy-number-original`;
      // Give the new VISIBLE input the original ID, so labels still work.
      originalInput.id = originalInput.id;
    }

    // Copy other essential attributes, excluding 'id'.
    ['class', 'placeholder', 'required'].forEach(attr => {
      if (originalInput.hasAttribute(attr)) {
        displayInput.setAttribute(attr, originalInput.getAttribute(attr));
      }
    });
    // --- End of Attribute Handling ---
    
    for (const prop of originalStyles) {
      displayInput.style[prop] = originalStyles.getPropertyValue(prop);
    }
    
    displayInput.style.position = 'static';
    displayInput.style.opacity = '1';
    displayInput.style.pointerEvents = 'auto';
    displayInput.style.margin = '0';
    
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = originalStyles.display === 'inline' ? 'inline-block' : originalStyles.display;
    wrapper.style.margin = originalStyles.margin;

    originalInput.style.position = 'absolute';
    originalInput.style.opacity = '0';
    originalInput.style.top = '0';
    originalInput.style.left = '0';
    originalInput.style.width = '100%';
    originalInput.style.height = '100%';
    originalInput.style.pointerEvents = 'none';
    originalInput.style.margin = '0';

    originalInput.parentNode.insertBefore(wrapper, originalInput);
    wrapper.appendChild(displayInput);
    wrapper.appendChild(originalInput);
    
    displayInput.value = format(originalInput.value);

    // ## 3. Synchronization ##
    displayInput.addEventListener('input', () => {
      const rawValue = unformat(displayInput.value);
      originalInput.value = rawValue;
      displayInput.value = format(rawValue);
    });
    
    displayInput.addEventListener('blur', () => {
       if (displayInput.value === conf.decimalSeparator) {
           displayInput.value = '';
           originalInput.value = '';
       }
    });
  }

  // ## 4. Initialize all target inputs ##
  document.querySelectorAll('input[data-type="currency"]').forEach(transformInput);
}

easyNumberSeparator()