import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onNewTask?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
}

/**
 * Custom hook for handling keyboard shortcuts
 * @param config - Configuration object with callback functions for different shortcuts
 */
export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey } = event;
      const isModifierPressed = ctrlKey || metaKey;

      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (key !== 'Escape' && !(isModifierPressed && key === 's')) {
          return;
        }
      }

      if (isModifierPressed && key === 'n' && config.onNewTask) {
        event.preventDefault();
        config.onNewTask();
      }

      if (isModifierPressed && key === 's' && config.onSave) {
        event.preventDefault();
        config.onSave();
      }

      if ((key === 'Delete' || key === 'Backspace') && config.onDelete) {
        event.preventDefault();
        config.onDelete();
      }

      if (key === 'Escape' && config.onEscape) {
        event.preventDefault();
        config.onEscape();
      }

      if (key === 'ArrowUp' && !shiftKey && config.onArrowUp) {
        event.preventDefault();
        config.onArrowUp();
      }

      if (key === 'ArrowDown' && !shiftKey && config.onArrowDown) {
        event.preventDefault();
        config.onArrowDown();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config]);
};
