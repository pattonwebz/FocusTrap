class FocusTrap {
  /**
   * Create a focus trap.
   * @param {HTMLElement} region - The region to trap focus within.
   * @param {HTMLElement} [trigger=null] - The element to return focus to when the trap is deactivated.
   * @param {HTMLElement} [initialFocus=null] - The element to focus when the trap is activated. If this is not passed the first focusable element within the region will be focused.
   */
  constructor(region, trigger = null, initialFocus = null) {
    this.region = region;
    this.trigger = trigger;

    if (!(this.region instanceof HTMLElement)) {
      throw new Error('The region must be an HTMLElement.');
    }

    if (this.trigger && !(this.trigger instanceof HTMLElement)) {
      throw new Error('If passed the trigger must be an HTMLElement.');
    }

    /**
     * All focusable elements within the region.
     * @type {NodeListOf<HTMLElement>}
     */
    this.focusableElements = this.region.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    this.focusableElements = (this.focusableElements.length) ? this.focusableElements : [this.region];

    /**
     * The first focusable element within the region.
     * @type {HTMLElement}
     */
    this.firstFocusableElement = this.focusableElements[0];

    /**
     * The last focusable element within the region.
     * @type {HTMLElement}
     */
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

    /**
     * The element to focus when the trap is activated.
     * If this is not passed the first focusable element within the region will be focused.
     * @type {HTMLElement}
     */
    this.initialFocus = initialFocus instanceof HTMLElement
      ? initialFocus
      : this.firstFocusableElement;

    if (this.initialFocus) {
      if (!this.focusableElements.includes(this.initialFocus)) {
        throw new Error('The initial focus element must be within the region.');
      }
    }
  }

  /**
   * Handle the keydown event to manage focus trapping.
   * @param {KeyboardEvent} event - The keydown event.
   */
  handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === this.firstFocusableElement) {
        this.lastFocusableElement.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === this.lastFocusableElement) {
        this.firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  }

  /**
   * Add event listeners to the region.
   */
  resume = () => this.region.addEventListener('keydown', this.handleKeyDown);

  /**
   * Remove the listeners from the region.
   */
  pause = () => this.region.removeEventListener('keydown', this.handleKeyDown);

  /**
   * Start the focus trap.
   *
   * This will add the event listeners and focus the first focusable element.
   */
  activate = () => {
    this.resume();
    this.firstFocusableElement.focus();
  }

  /**
   * Remove the focus trap.
   *
   * This will remove the event listeners and focus the trigger element if one was provided.
   */
  deactivate = () => {
    this.pause();
    this.trigger?.focus();
  }
}

module.exports = FocusTrap;
