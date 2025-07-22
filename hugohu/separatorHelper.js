/**
 * Creates a formatted text input over an existing number input,
 * preserving all original CSS styles.
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
  
    // ## 2. The Transformation Logic (with Style Copying) ##
    function transformInput(originalInput) {
      if (originalInput.dataset.isSeparated) return;
      originalInput.dataset.isSeparated = 'true';
      
      // --- KEY CHANGE STARTS HERE ---
      
      // Get all the styles currently applied to the original input
      const originalStyles = window.getComputedStyle(originalInput);
  
      // Create the visible input for the user
      const displayInput = document.createElement('input');
      displayInput.setAttribute('type', 'text');
      displayInput.setAttribute('inputmode', 'decimal');
      
      // Apply every computed style from the original to the new input
      // This makes it a perfect visual clone.
      for (const prop of originalStyles) {
        displayInput.style[prop] = originalStyles.getPropertyValue(prop);
      }
      
      // Unset properties that should not be inherited for positioning
      displayInput.style.position = 'static';
      displayInput.style.opacity = '1';
      displayInput.style.pointerEvents = 'auto';
      displayInput.style.margin = '0'; // Margin will be handled by the wrapper
      
      // --- KEY CHANGE ENDS HERE ---
  
      // Create a wrapper to hold both inputs
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      // The wrapper should take the original input's place in the layout
      wrapper.style.display = originalStyles.display === 'inline' ? 'inline-block' : originalStyles.display;
      wrapper.style.margin = originalStyles.margin;
  
      // Hide original input visually but keep it functional
      originalInput.style.position = 'absolute';
      originalInput.style.opacity = '0';
      originalInput.style.top = '0';
      originalInput.style.left = '0';
      originalInput.style.width = '100%';
      originalInput.style.height = '100%';
      originalInput.style.pointerEvents = 'none';
      originalInput.style.margin = '0';
  
      // Structure the DOM
      originalInput.parentNode.insertBefore(wrapper, originalInput);
      wrapper.appendChild(displayInput);
      wrapper.appendChild(originalInput);
      
      // Set initial value
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
    document.querySelectorAll('input[data-type="easy-number-separator"]').forEach(transformInput);
  }

  easyNumberSeparator();