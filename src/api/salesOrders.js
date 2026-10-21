const BASE_URL = 'https://hiring.harrisons.my/api/mock/sales-orders';
const API_KEY = 'hssb-assessment-mock-2026';

const headers = {
  'x-assessment-key': API_KEY,
  'Content-Type': 'application/json',
};

/**
 * Fetch paginated sales orders with optional filters.
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=25]
 * @param {string} [params.status]
 * @param {string} [params.site]
 * @param {string} [params.q]
 * @param {string} [params.sort]
 * @param {string} [params.order]
 * @returns {Promise<Object>} API response with summary, data, pagination info
 */
export async function fetchSalesOrders({
  page = 1,
  pageSize = 25,
  status,
  site,
  q,
  sort,
  order,
} = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('pageSize', pageSize);
  if (status) params.set('status', status);
  if (site) params.set('site', site);
  if (q) params.set('q', q);
  if (sort) params.set('sort', sort);
  if (order) params.set('order', order);

  const response = await fetch(`${BASE_URL}?${params.toString()}`, { headers });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single sales order by its SalesId.
 * @param {string} salesId
 * @returns {Promise<Object>}
 */
export async function fetchSalesOrderById(salesId) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(salesId)}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch API metadata (statuses, sites, etc.).
 * @returns {Promise<Object>}
 */
export async function fetchMeta() {
  const response = await fetch(`${BASE_URL}/meta`, { headers });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
