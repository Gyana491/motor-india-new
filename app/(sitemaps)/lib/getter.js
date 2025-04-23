import { BACKEND } from '@/utils/constants';

export async function getAllCarModelPages() {
  let allPages = [];
  let page = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const response = await fetch(`${BACKEND || process.env.BACKEND}/wp-admin/admin-ajax.php?action=get_all_cars_json&page=${page}&per_page=20`,{
        next: { revalidate: 86400 } // Revalidate every day
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          hasMorePages = false;
          break;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const pages = data.pages || [];

      if (!pages.length || page >= data.pagination.total_pages) {
        hasMorePages = false;
      }

      allPages = [...allPages, ...pages];
      page++;

    } catch (error) {
      console.error('Error fetching cars:', error);
      hasMorePages = false;
    }
  }

  return allPages;
}
