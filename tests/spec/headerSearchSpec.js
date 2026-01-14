import { buildHomeSearchUrl } from '../../scripts/utils/headerSearch.js';

describe('buildHomeSearchUrl', () => {
  it('adds search param when query is provided', () => {
    const href = 'http://localhost:5500/checkout.html';
    const url = buildHomeSearchUrl(href, 'socks');

    expect(url).toContain('homePage.html');
    expect(url).toContain('search=socks');
  });

  it('trims whitespace', () => {
    const href = 'http://localhost:5500/orders.html';
    const url = buildHomeSearchUrl(href, '  basketball  ');

    expect(url).toContain('search=basketball');
  });

  it('removes search param when query is empty', () => {
    const href = 'http://localhost:5500/homePage.html?search=socks';
    const url = buildHomeSearchUrl(href, '   ');

    expect(url).toContain('homePage.html');
    expect(url).not.toContain('search=');
  });
});