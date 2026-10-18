import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { StoriesPage } from '@/features/stories/StoriesPage';
import '@/i18n';

describe('Modal & Sheet Focus & Continuous Typing', () => {
  it('does NOT steal focus or interrupt typing when state updates inside Modal with inline onClose', () => {
    const TestComponent = () => {
      const [isOpen, setIsOpen] = useState(true);
      const [text, setText] = useState('');

      return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Modal">
          <input
            data-testid="modal-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Modal>
      );
    };

    render(<TestComponent />);

    const input = screen.getByTestId('modal-input');
    input.focus();
    expect(document.activeElement).toBe(input);

    // Type characters sequentially
    fireEvent.change(input, { target: { value: 'H' } });
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: 'He' } });
    expect(document.activeElement).toBe(input);

    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(document.activeElement).toBe(input);
    expect(input).toHaveValue('Hello World');
  });

  it('does NOT steal focus or interrupt typing when state updates inside Sheet with inline onClose', () => {
    const TestComponent = () => {
      const [isOpen, setIsOpen] = useState(true);
      const [text, setText] = useState('');

      return (
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Test Sheet">
          <textarea
            data-testid="sheet-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Sheet>
      );
    };

    render(<TestComponent />);

    const textarea = screen.getByTestId('sheet-textarea');
    textarea.focus();
    expect(document.activeElement).toBe(textarea);

    fireEvent.change(textarea, { target: { value: 'First line\nSecond line' } });
    expect(document.activeElement).toBe(textarea);
    expect(textarea).toHaveValue('First line\nSecond line');
  });

  it('handles Escape key in Modal without breaking on inline onClose', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Escape Modal">
        <p>Modal content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('Feedback Form Typing & Submission', () => {
  it('allows clicking into feedback modal and typing continuously across all fields', async () => {
    render(<StoriesPage />);

    // Open feedback modal
    const openButtons = screen.getAllByRole('button', { name: /feedback|retours/i });
    expect(openButtons.length).toBeGreaterThan(0);
    fireEvent.click(openButtons[0]!);

    // Find textarea
    const textarea = screen.getByRole('textbox', {
      name: /suggestion or experience feedback|votre suggestion ou retour/i,
    });
    textarea.focus();
    expect(document.activeElement).toBe(textarea);

    // Type complete multi-sentence paragraph
    const feedbackText =
      'BridgeSign helped communicate clearly at the hospital. Adding more regional medical signs would be wonderful!';
    fireEvent.change(textarea, { target: { value: feedbackText } });

    expect(textarea).toHaveValue(feedbackText);
    expect(document.activeElement).toBe(textarea);

    // Editing in the middle and deleting text
    fireEvent.change(textarea, {
      target: {
        value: 'BridgeSign helped communicate clearly at the hospital. Extra signs needed.',
      },
    });
    expect(textarea).toHaveValue(
      'BridgeSign helped communicate clearly at the hospital. Extra signs needed.'
    );
    expect(document.activeElement).toBe(textarea);
  });
});

describe('Button & IconButton Default Types', () => {
  it('defaults Button to type="button" to prevent accidental form submission', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('allows explicit type="submit" on Button when needed', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('defaults IconButton to type="button" to prevent accidental form submission', () => {
    render(<IconButton aria-label="Delete item"><span>x</span></IconButton>);
    const button = screen.getByRole('button', { name: /delete item/i });
    expect(button).toHaveAttribute('type', 'button');
  });
});
