const ACRONYMS = new Set(['ai', 'ml', 'api', 'ui', 'ux', 'sql', 'css', 'html']);

export function formatFolderName(folder: string): string {
  return folder
    .split('-')
    .map((word) => {
      const lower = word.toLowerCase();
      return ACRONYMS.has(lower) ? lower.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
