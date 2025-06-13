import { BACKEND } from '@/app/utils/constants';

/**
 * WordPress Service for Motor India
 * Handles all WordPress API interactions for posts, categories, tags, and content
 */
class WordPressService {
  constructor() {
    this.baseURL = BACKEND || process.env.BACKEND || 'https://cdn.motorindia.in';
    this.apiBase = `${this.baseURL}/wp-json/wp/v2`;
  }

  /**
   * Fetch all English posts with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Posts per page (default: 100)
   * @returns {Promise<Array>} Array of posts
   */
  async getAllPosts(page = 1, perPage = 100) {
    try {
      const response = await fetch(
        `${this.apiBase}/posts?_embed=true&page=${page}&per_page=${perPage}&status=publish`,
        {
          next: { revalidate: 3600 } // Revalidate every hour
        }
      );

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          return [];
        }
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const posts = await response.json();
      return this.transformPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  /**
   * Fetch all Hindi posts with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} perPage - Posts per page (default: 100)
   * @returns {Promise<Array>} Array of hindi posts
   */
  async getAllHindiPosts(page = 1, perPage = 100) {
    try {
      const response = await fetch(
        `${this.apiBase}/hindi?_embed=true&page=${page}&per_page=${perPage}&status=publish`,
        {
          next: { revalidate: 3600 } // Revalidate every hour
        }
      );

      if (!response.ok) {
        if (response.status === 400 || response.status === 404) {
          return [];
        }
        throw new Error(`Failed to fetch hindi posts: ${response.status}`);
      }

      const posts = await response.json();
      return this.transformPosts(posts, 'hindi');
    } catch (error) {
      console.error('Error fetching hindi posts:', error);
      return [];
    }
  }

  /**
   * Fetch all English categories
   * @returns {Promise<Array>} Array of categories
   */
  async getAllCategories() {
    try {
      const response = await fetch(
        `${this.apiBase}/categories?per_page=100&hide_empty=true`,
        {
          next: { revalidate: 86400 } // Revalidate daily
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const categories = await response.json();
      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        count: cat.count,
        link: `/articles/category/${cat.slug}`
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Fetch all Hindi categories
   * @returns {Promise<Array>} Array of hindi categories
   */
  async getAllHindiCategories() {
    try {
      const response = await fetch(
        `${this.apiBase}/hindi_category?per_page=100&hide_empty=true`,
        {
          next: { revalidate: 86400 } // Revalidate daily
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch hindi categories: ${response.status}`);
      }

      const categories = await response.json();
      return categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        count: cat.count,
        link: `/hindi/category/${cat.slug}`
      }));
    } catch (error) {
      console.error('Error fetching hindi categories:', error);
      return [];
    }
  }

  /**
   * Fetch all English tags
   * @returns {Promise<Array>} Array of tags
   */
  async getAllTags() {
    try {
      const response = await fetch(
        `${this.apiBase}/tags?per_page=100&hide_empty=true`,
        {
          next: { revalidate: 86400 } // Revalidate daily
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.status}`);
      }

      const tags = await response.json();
      return tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        count: tag.count,
        link: `/articles/tag/${tag.slug}`
      }));
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  /**
   * Fetch all Hindi tags
   * @returns {Promise<Array>} Array of hindi tags
   */
  async getAllHindiTags() {
    try {
      const response = await fetch(
        `${this.apiBase}/hindi_tag?per_page=100&hide_empty=true`,
        {
          next: { revalidate: 86400 } // Revalidate daily
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch hindi tags: ${response.status}`);
      }

      const tags = await response.json();
      return tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        count: tag.count,
        link: `/hindi/tag/${tag.slug}`
      }));
    } catch (error) {
      console.error('Error fetching hindi tags:', error);
      return [];
    }
  }

  /**
   * Fetch all posts with automatic pagination
   * @param {string} postType - 'posts' for English, 'hindi' for Hindi
   * @returns {Promise<Array>} Array of all posts
   */
  async getAllPostsWithPagination(postType = 'posts') {
    let allPosts = [];
    let page = 1;
    let hasMorePosts = true;

    while (hasMorePosts) {
      try {
        const fetchMethod = postType === 'hindi' ? 'getAllHindiPosts' : 'getAllPosts';
        const posts = await this[fetchMethod](page, 100);

        if (!posts.length) {
          hasMorePosts = false;
        } else {
          allPosts = [...allPosts, ...posts];
          page++;
          
          // Safety check to prevent infinite loops
          if (posts.length < 100) {
            hasMorePosts = false;
          }
        }
      } catch (error) {
        console.error(`Error fetching ${postType} page ${page}:`, error);
        hasMorePosts = false;
      }
    }

    return allPosts;
  }

  /**
   * Transform WordPress posts data to a more usable format
   * @param {Array} posts - Raw WordPress posts
   * @param {string} postType - 'english' or 'hindi'
   * @returns {Array} Transformed posts
   */
  transformPosts(posts, postType = 'english') {
    return posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title?.rendered || '',
      excerpt: post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      content: post.content?.rendered || '',
      date: post.date,
      modified: post.modified,
      status: post.status,
      type: postType,
      link: postType === 'hindi' ? `/hindi/${post.slug}` : `/articles/${post.slug}`,
      author: post._embedded?.author?.[0]?.name || '',
      categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || [],
      tags: post._embedded?.['wp:term']?.[1]?.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug
      })) || [],
      featuredImage: {
        url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
        alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
        caption: post._embedded?.['wp:featuredmedia']?.[0]?.caption?.rendered || ''
      },
      seo: {
        metaTitle: post.yoast_head_json?.title || post.title?.rendered,
        metaDescription: post.yoast_head_json?.description || post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160),
        canonicalUrl: post.yoast_head_json?.canonical || post.link
      }
    }));
  }

  /**
   * Get post by slug
   * @param {string} slug - Post slug
   * @param {string} postType - 'posts' or 'hindi'
   * @returns {Promise<Object|null>} Post object or null
   */
  async getPostBySlug(slug, postType = 'posts') {
    try {
      const endpoint = postType === 'hindi' ? 'hindi' : 'posts';
      const response = await fetch(
        `${this.apiBase}/${endpoint}?slug=${slug}&_embed=true`,
        {
          next: { revalidate: 3600 }
        }
      );

      if (!response.ok) {
        return null;
      }

      const posts = await response.json();
      if (!posts.length) {
        return null;
      }

      const transformedPosts = this.transformPosts(posts, postType === 'hindi' ? 'hindi' : 'english');
      return transformedPosts[0];
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }
}

// Export singleton instance
const wordpressService = new WordPressService();
export default wordpressService;

// Export the class for testing purposes
export { WordPressService };
