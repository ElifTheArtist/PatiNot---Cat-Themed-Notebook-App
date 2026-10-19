const paths = {
  plus: 'M12 5v14M5 12h14',
  search: 'M21 21l-5-5M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0',
  notes: 'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3M8 3v4h8V3H8M7 12h10M7 16h7',
  pin: 'M16 3l5 5-5 1-3 4-1 4-5-5 4-1 4-3 1-5M8 16l-5 5',
  edit: 'M16 3l5 5M4 20l4-1L21 6a2.8 2.8 0 0 0-4-4L4 15l-1 6 1-1',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12l4 4L19 6',
};
export default function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}><path d={paths[name] || paths.notes} /></svg>;
}
