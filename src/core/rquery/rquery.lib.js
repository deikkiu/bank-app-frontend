import { formatCardNumberWithDashes } from "@/utils/format/format-card-number";

/**
 * Represents the RQuery class for working with DOM elements
 */
class RQuery {

    /**
     * Create a new RQuery instance.
     * @param {string|HTMLElement} selector - A CSS selector string or an HTMLElement.
     */
    constructor(selector) {
        if(typeof selector === 'string') {
            this.element = document.querySelector(selector);

            if(!this.element) {
                throw new Error(`Element ${selector} not found!`);
            }
        } else if(selector instanceof HTMLElement) {
            this.element = selector;
        } else {
            throw new Error(`Invalid Selector type`);
        }
    }

    /* FIND */

    /**
     *
     * @param {string} selector string selector
     * @returns {RQuery} new RQuery with given selector
     */
    find(selector) {
        if(!selector) return;

        const element = new RQuery(this.element.querySelector(selector));

        if(element) {
            return element;
        } else {
            throw new Error(`Element ${selector} not found!`);
        }
    }

    /**
     *
     * @param {string} selector string selector
     * @returns {RQuery[]} new RQuery with given selector
     */
    findAll(selector) {
        const elements = this.element.querySelectorAll(selector);
        return Array.from(elements).map(element => new RQuery(element));
    }


    // HTML

    /**
     *
     * @param {string} [htmlContent] Optional HTML content to set
     * @returns {RQuery|string} The current RQuery or the current inner HTML when getting.
     */
    html(htmlContent) {
        if(typeof htmlContent === "undefined") {
            return this.element.innerHTML;
        } else {
            this.element.innerHTML = htmlContent;
            return this;
        }
    }

    /**
     *
     * @param {string} [textContent] Optional HTML content to set
     * @returns {RQuery|string} The current RQuery or the current inner HTML when getting.
     */
    text(textContent) {
        if(typeof textContent === "undefined") {
            return this.element.textContent;
        } else {
            this.element.textContent = textContent;
            return this;
        }
    }

    /* EVENTS */

    /**
     * Add an event listener to the selected element for the specified event type.
     * @param {string} eventType - The type of event to listen
     * @param {function{Event}: void} callback - The event listener function to execute when the event is triggered.
     * @returns {RQuery} The current RQuery instance for chaining.
     */
    on(eventType, callback) {
        if(typeof eventType !== 'string' || typeof callback !== 'function') {
            throw new Error('eventType must be a string and callback must be a function1');
        }

        this.element.addEventListener(eventType, callback);
        return this;
    }



    /**
     *
     * @param {Function} callback We hang up the callback by clicking on the button
     * @returns {RQuery}
     */
    click(callback) {
        this.element.addEventListener('click', callback);
        return this;
    }

    /* FORM */

    /**
     * Set an event listener for the submit event of a form element
     * @param {function(Event): void} onSubmit - The event listener for the form's submit event
     * @returns {RQuery} The current RQuery instance for chaining.
     */
    submit(onSubmit) {
        if(this.element.tagName.toLowerCase() === 'form') {
            this.element.addEventListener('submit', (e) => {
                e.preventDefault();
                onSubmit(e);
            });
        } else {
            throw new Error('Element  must be a form!');
        }

        return this;
    }


    /**
     * Gets or sets the value if an input element
     * @param {string} [newValue] - The new value to set for yhe input element.
     * @param {string|RQuery} - The value from input or the current RQuery instance for chaining.
     */
    value(newValue) {
        if(this.element.tagName.toLowerCase() === 'input') {

            if(typeof newValue === 'undefined') {
                return this.element.value;
            }

            this.element.value = newValue;
            return this;
        } else {
            throw new Error('Element  must be a input!');
        }
    }

	/**
	 * Set attributes and event listeners for an input element.
	 * @param {object} options - An object containing input options.
	 * @param {function(Event): void} [options.onInput] - The event listener for the input's input event.
	 * @param {object} [options.rest] - Optional attributes to set on the input element.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	input({ onInput, ...rest }) {
		if (this.element.tagName.toLowerCase() !== 'input')
			throw new Error('Element must be an input');

		for (const [key, value] of Object.entries(rest)) {
			this.element.setAttribute(key, value);
		}

		if (onInput) {
			this.element.addEventListener('input', onInput);
		}

		return this;
	}

	/**
	 * Set attributes and event listeners for a number input element.
	 * @param {number} [limit] - The maximum length of input value.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	numberInput(limit) {
		if (
			this.element.tagName.toLowerCase() !== 'input' ||
			this.element.type !== 'number'
		)
			throw new Error('Element must be an input with type "number"');

		this.element.addEventListener('input', event => {
			let value = event.target.value.replace(/[^0-9]/g, '');
			if (limit) value = value.substring(0, limit);
			event.target.value = value;
		})

		return this;
	}

	/**
	 * Set attributes and event listeners for a credit card input element.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	creditCardInput() {
		const limit = 16;

		if (
			this.element.tagName.toLowerCase() !== 'input' ||
			this.element.type !== 'text'
		)
			throw new Error('Element must be an input with type "text"');

		this.element.addEventListener('input', event => {
			let value = event.target.value.replace(/[^0-9]/g, '');
			if (limit) value = value.substring(0, limit);
			event.target.value = formatCardNumberWithDashes(value);
		})

		return this;
	}

    // STYLES

    /**
     * Shows the selected element by removing the 'display' style property.
     * @returns {RQuery} The current RQuery instance of chaining
     */
    show() {
        this.element.style.removeProperty('display');
        return this;
    }

    /**
     * Hide the selected element by removing the 'display' style property.
     * @returns {RQuery} The current RQuery instance of chaining
     */
    hide() {
        this.element.style.display = 'none';
        return this;
    }

    /**
     *
     * @param {string} property The CSS property to set
     * @param {string} value The value to set for the CSS property
     * @returns {RQuery}
     */
    css(property, value) {
        if(typeof property !== 'string' || typeof value !== 'string') {
            throw new Error('property and value must be string');
        }

        this.element.style[property] = value;
        return this;
    }

    /**
     *
     * @param {string | string[]} classNames A single class name or an array of class names to add the element
     * @returns {RQuery} The current RQuery instance of chaining
     */
    addClass(classNames) {
        if(Array.isArray(classNames)) {
            classNames.forEach((className) =>  this.element.classList.add(className));
        } else {
            this.element.classList.add(classNames);
        }
        return this;
    }

    /**
     *
     * @param {string | string[]} classNames A single class name or an array of class names to remove the element
     * @returns {RQuery} The current RQuery instance of chaining
     */
    removeClass(classNames) {
        if(Array.isArray(classNames)) {
            classNames.forEach((className) => {
                if(this.element.classList.contains(className)) {
                    this.element.classList.remove(className);
                }
            });
        } else {
            if(this.element.classList.contains(classNames)) {
                this.element.classList.remove(classNames);
            }
        }
        return this;
    }

    /**
     *
     * @param {string} attributeName The name of the attribute to set or get
     * @param {string} value The value to set for the attribute
     * @returns {RQuery|string} The current RQuery instance for chaining
     */
    attr(attributeName, value) {
        if(typeof attributeName !== 'string') {
            throw new Error('Attribute name must be a string');
        }

        if(typeof value === 'undefined') {
            return this.element.getAttribute(attributeName);
        } else {
            this.element.setAttribute(attributeName, value);
            return this;
        }
    }


    /**
     * Removes an attribute name from element
     * @param {string} attrName - The name of attribute to remove.
     * @returns {RQuery} The current RQuery instance for chaining.
     */
    removeAttr(attrName) {
        if(typeof attrName !== 'string') {
            throw new Error('Attribute name must be a string');
        }

        this.element.removeAttribute(attrName);
        return this;
    }

    /* INSERT */

    /**
     *
     * @param {HTMLElement} childElement HTML childElement needed to append in this.element
     * @returns {HTMLElement} HTML element appended given template
     */
    append(childElement) {
        if(childElement instanceof HTMLElement || childElement instanceof SVGSVGElement) {
            this.element.appendChild(childElement);
            return this;
        } else {
            throw new Error(`Given ${childElement} must be HTMLElement`);
        }
    }

    /**
     *
     * @param {HTMLElement} newElement HTML childElement needed to append BEFORE this.element
     * @returns {HTMLElement} HTML element appended given template
     */
    before(newElement) {
        if(!(newElement instanceof HTMLElement)) {
            throw new Error(`Given ${newElement} must be HTMLElement`);
        }

        const parentElement = this.element.parentElement;

        if(parentElement) {
            parentElement.insertBefore(newElement, this.element);
            return this;
        } else {
            throw new Error('Element does not have a parent element!');
        }
    }

}

/**
 * Create a new RQuery instance for the given selector
 * @param {string|HTMLElement} selector - A CSS selector string or an HTMLElement.
 * @returns {RQuery} A new RQuery instance for the given selector
 */
export function $R(selector) {
    return new RQuery(selector);
}