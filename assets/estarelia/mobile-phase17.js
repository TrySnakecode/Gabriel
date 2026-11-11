/* Accessibility: make the local management listing readable as cards on mobile. */
(() => {
  const table = document.querySelector('.admin-table');
  if (!table) return;
  const apply = () => {
    const labels = Array.from(table.querySelectorAll('thead th')).map(h => h.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row => {
      Array.from(row.children).forEach((cell, idx) => {
        if (cell.tagName === 'TD' && cell.dataset.mobileLabel !== (labels[idx] || ''))
          cell.dataset.mobileLabel = labels[idx] || '';
      });
    });
  };
  apply();
  new MutationObserver(apply).observe(table, {childList: true, subtree: true});
})();
