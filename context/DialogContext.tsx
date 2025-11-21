import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type DialogVariant = 'alert' | 'confirm' | 'prompt';

interface DialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  defaultValue?: string;
  destructive?: boolean;
}

interface DialogState extends DialogOptions {
  variant: DialogVariant;
  resolve: (value: boolean | string | null) => void;
}

interface DialogContextValue {
  alert: (options: DialogOptions) => Promise<void>;
  confirm: (options: DialogOptions) => Promise<boolean>;
  prompt: (options: DialogOptions) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [inputValue, setInputValue] = useState('');

  const openDialog = useCallback(
    (options: DialogOptions & { variant: DialogVariant }) =>
      new Promise<boolean | string | null>((resolve) => {
        setInputValue(options.defaultValue ?? '');
        setDialog({
          title: options.title,
          message: options.message,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          placeholder: options.placeholder,
          defaultValue: options.defaultValue,
          destructive: options.destructive,
          variant: options.variant,
          resolve
        });
      }),
    []
  );

  const alert = useCallback(
    (options: DialogOptions) =>
      openDialog({
        variant: 'alert',
        confirmText: options.confirmText ?? 'OK',
        message: options.message,
        title: options.title,
        destructive: options.destructive
      }).then(() => undefined),
    [openDialog]
  );

  const confirm = useCallback(
    (options: DialogOptions) =>
      openDialog({
        variant: 'confirm',
        confirmText: options.confirmText ?? 'Confirm',
        cancelText: options.cancelText ?? 'Cancel',
        message: options.message,
        title: options.title,
        destructive: options.destructive
      }).then((result) => result === true),
    [openDialog]
  );

  const prompt = useCallback(
    (options: DialogOptions) =>
      openDialog({
        variant: 'prompt',
        confirmText: options.confirmText ?? 'Submit',
        cancelText: options.cancelText ?? 'Cancel',
        placeholder: options.placeholder,
        defaultValue: options.defaultValue,
        message: options.message,
        title: options.title,
        destructive: options.destructive
      }).then((result) => (typeof result === 'string' ? result : null)),
    [openDialog]
  );

  const closeDialog = useCallback(() => {
    setDialog(null);
    setInputValue('');
  }, []);

  const handleConfirm = useCallback(() => {
    if (!dialog) return;
    if (dialog.variant === 'prompt') {
      dialog.resolve(inputValue);
    } else {
      dialog.resolve(true);
    }
    closeDialog();
  }, [dialog, inputValue, closeDialog]);

  const handleCancel = useCallback(() => {
    if (!dialog) return;
    if (dialog.variant === 'prompt') {
      dialog.resolve(null);
    } else {
      dialog.resolve(false);
    }
    closeDialog();
  }, [dialog, closeDialog]);

  useEffect(() => {
    if (!dialog) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
      }
      if (event.key === 'Enter' && dialog.variant !== 'alert') {
        event.preventDefault();
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dialog, handleCancel, handleConfirm]);

  const contextValue = useMemo(
    () => ({
      alert,
      confirm,
      prompt
    }),
    [alert, confirm, prompt]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {dialog &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4"
            onMouseDown={handleCancel}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onMouseDown={(e) => e.stopPropagation()}
            >
              {dialog.title && <h2 className="text-lg font-semibold text-gray-900">{dialog.title}</h2>}
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{dialog.message}</p>
              {dialog.variant === 'prompt' && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    {dialog.placeholder || 'Enter a value'}
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-parish-blue focus:outline-none focus:ring-2 focus:ring-parish-blue/30"
                    placeholder={dialog.placeholder}
                  />
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                {dialog.variant !== 'alert' && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    {dialog.cancelText ?? 'Cancel'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                    dialog.destructive
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-parish-blue hover:bg-blue-800'
                  }`}
                >
                  {dialog.confirmText ?? 'OK'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
