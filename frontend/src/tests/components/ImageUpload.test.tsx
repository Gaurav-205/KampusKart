import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '../../components/common/ImageUpload';

const png = (name = 'photo.png', size = 1024) =>
  new File([new Uint8Array(size)], name, { type: 'image/png' });

describe('ImageUpload', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:preview');
    URL.revokeObjectURL = vi.fn();
  });

  it('accepts images dropped onto the drop zone', () => {
    const onImagesChange = vi.fn();
    render(<ImageUpload images={[]} onImagesChange={onImagesChange} id="test" />);

    const dropzone = screen.getByTestId('test-dropzone');
    const dropEvent = fireEvent.drop(dropzone, { dataTransfer: { files: [png()] } });

    // preventDefault stops the browser from navigating away to the dropped file
    expect(dropEvent).toBe(false);
    expect(onImagesChange).toHaveBeenCalledWith([
      expect.objectContaining({ previewUrl: 'blob:preview' }),
    ]);
  });

  it('tells the user why a file was rejected instead of ignoring it', () => {
    const onImagesChange = vi.fn();
    render(<ImageUpload images={[]} onImagesChange={onImagesChange} maxSizeMB={1} id="test" />);

    const input = document.getElementById('test') as HTMLInputElement;
    fireEvent.change(input, {
      target: {
        files: [
          png('huge.png', 2 * 1024 * 1024),
          new File(['x'], 'notes.pdf', { type: 'application/pdf' }),
        ],
      },
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('huge.png');
    expect(alert).toHaveTextContent('notes.pdf');
    expect(onImagesChange).not.toHaveBeenCalled();
  });

  it('reports when more files are dropped than the remaining slots', () => {
    const onImagesChange = vi.fn();
    render(<ImageUpload images={[]} onImagesChange={onImagesChange} maxImages={2} id="test" />);

    fireEvent.drop(screen.getByTestId('test-dropzone'), {
      dataTransfer: { files: [png('a.png'), png('b.png'), png('c.png')] },
    });

    expect(onImagesChange).toHaveBeenCalledWith([expect.anything(), expect.anything()]);
    expect(screen.getByRole('alert')).toHaveTextContent('up to 2 images');
  });
});
