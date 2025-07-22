class FocusTrap {
  /**
   * Create a focus trap.
   * @param {HTMLElement} region - The region to trap focus within.
   * @param {HTMLElement} [trigger=null] - The element to return focus to when the trap is deactivated.
   * @param {HTMLElement} [initialFocus=null] - The element to focus when the trap is activated. If this is not passed the first focusable element within the region will be focused.
   * @param {boolean} [dynamic=false] - If true, recalculate focusable elements on every tab press to handle dynamic content.
   */
  constructor(region, trigger = null, initialFocus = null, dynamic = false) {
    this.region = region;
    this.trigger = trigger;
    this.dynamic = dynamic;

    if (!(this.region instanceof HTMLElement)) {
      throw new Error('The region must be an HTMLElement.');
    }
    if (this.trigger && !(this.trigger instanceof HTMLElement)) {
      throw new Error('If passed, the trigger must be an HTMLElement.');
    }

    this.setFocusableElements();

    this.initialFocus = initialFocus instanceof HTMLElement
      ? initialFocus
      : this.firstFocusableElement;

    if (this.initialFocus) {
      if (!this.focusableElements.includes(this.initialFocus)) {
        throw new Error('The initial focus element must be within the region and be visible/focusable.');
      }
    }
  }

  /**
   * Check if an element is focusable and visible.
   */
  isFocusable(el) {
    if (!(el instanceof HTMLElement)) return false;
    // Must be in the region
    if (!this.region.contains(el)) return false;
    // Not disabled
    if (el.hasAttribute('disabled')) return false;
    // Must be focusable by keyboard
    if (el.tabIndex < 0) return false;
    // Must be visible
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    // Must not be hidden by ancestor
    if (el.offsetParent === null && style.position !== 'fixed') return false;
    return true;
  }

  /**
   * Find all focusable elements in the region.
   */
  getFocusableElements() {
    const elements = Array.from(this.region.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    return elements.filter(el => this.isFocusable(el));
  }

  /**
   * Set the list of focusable elements, and first/last references.
   */
  setFocusableElements() {
    this.focusableElements = this.getFocusableElements();
    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  /**
   * Keydown handler for trapping focus.
   */
  handleKeyDown = (event) => {
    if (event.key !== 'Tab') return;

    if (this.dynamic) {
      this.setFocusableElements();
    }

    if (!this.firstFocusableElement || !this.lastFocusableElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey) {
      if (document.activeElement === this.firstFocusableElement) {
        this.lastFocusableElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === this.lastFocusableElement) {
        this.firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  }

  resume = () => this.region.addEventListener('keydown', this.handleKeyDown);

  pause = () => this.region.removeEventListener('keydown', this.handleKeyDown);

  activate = () => {
    this.resume();
    this.setFocusableElements();
    if (this.initialFocus && this.focusableElements.includes(this.initialFocus)) {
      this.initialFocus.focus();
    } else if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }

  deactivate = () => {
    this.pause();
    if (this.trigger instanceof HTMLElement) {
      this.trigger.focus();
    }
  }
}

module.exports = FocusTrap;