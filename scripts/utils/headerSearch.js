export function setupHeaderSearchRedirect() {
  const input = document.querySelector('.search-input');
  const button = document.querySelector('.search-button');
  if (!input || !button) return;

  function go() {
    const q = input.value.trim();
    const url = new URL('homePage.html', window.location.href);
    if (q) url.searchParams.set('search', q);
    window.location.href = url.toString();
  }

  button.addEventListener('click', go);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') go();
  });
}