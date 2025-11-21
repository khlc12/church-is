export const formatDate = (value?: string | null, options?: Intl.DateTimeFormatOptions) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, options ?? { year: 'numeric', month: 'short', day: 'numeric' });
};
