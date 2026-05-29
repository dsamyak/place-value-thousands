import { useRef, useEffect } from 'react';

export function useDragDrop({ onDrop }) {
  const dragState = useRef({
    dragging: false,
    itemData: null,
    cloneEl: null,
  });

  function handlePointerDown(e, itemData) {
    e.preventDefault();
    const state = dragState.current;
    state.dragging = true;
    state.itemData = itemData;

    // Create floating clone
    const clone = e.currentTarget.cloneNode(true);
    clone.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      opacity: 0.85; transform: scale(1.1);
      left: ${e.clientX - 30}px; top: ${e.clientY - 30}px;
    `;
    document.body.appendChild(clone);
    state.cloneEl = clone;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }

  function handlePointerMove(e) {
    const state = dragState.current;
    if (!state.dragging) return;
    
    if (state.cloneEl) {
      state.cloneEl.style.left = `${e.clientX - 30}px`;
      state.cloneEl.style.top = `${e.clientY - 30}px`;
    }

    // Highlight drop zones
    const el = document.elementFromPoint(e.clientX, e.clientY);
    document.querySelectorAll('[data-dropzone]').forEach(z => z.classList.remove('drop-hover'));
    const zone = el?.closest('[data-dropzone]');
    if (zone) zone.classList.add('drop-hover');
  }

  function handlePointerUp(e) {
    const state = dragState.current;
    if (!state.dragging) return;
    state.dragging = false;
    
    if (state.cloneEl && document.body.contains(state.cloneEl)) {
      document.body.removeChild(state.cloneEl);
    }
    state.cloneEl = null;
    
    document.querySelectorAll('[data-dropzone]').forEach(z => z.classList.remove('drop-hover'));

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const zone = el?.closest('[data-dropzone]');
    if (zone && onDrop) {
      onDrop(state.itemData, zone.dataset.dropzone);
    }

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }

  return { handlePointerDown };
}
