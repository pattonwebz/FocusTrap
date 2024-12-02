# FocusTrap
It's a simple - pure vanilla JS - focus trap. No frills, just straightforward use.

You can start the trap with just a region.

Optionally (and highly recommended) you can pass a triggering element which focus will be returned to on ending. 

Optionally, you can pass an element inside the region that will be the first focused element. Otherwise, the first focusable element will be used (falling back to the region itself if no focusable items are inside).

## Using FocusTrap

```js
// With a region to trap and a trigger element.
const regionElement = document.getElementById( 'aModalElement' );
const triggerElement = document.getElementById( 'aTriggerButton' );

// Create a new FocusTrap with them.
const trap = new FocusTrap( regionElement, triggerElement );

// Start the trap.
trap.activate();
// Pause the trap.
trap.pause();
// Resume the trap.
trap.resume();
// End the trap.
trap.deactivate();
```
