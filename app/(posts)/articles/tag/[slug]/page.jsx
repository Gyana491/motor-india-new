'use client';

import Link from "next/link"
import Image from "next/image"
import { useState } from 'react'
import TagArchive from './components/TagArchive'

// Post Card Component
const PostCard = ({ post }) => (
  <Link 
    href={`/${post.postType === 'hindi' ? 'hindi' : 'articles'}/${post.slug}`}
    className="group"
  >
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {post.image_url && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.image_alt || post.title}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {post.category && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-medium px-2.5 py-1 rounded">
              {post.category}
            </span>
          )}
          {post.postType === 'hindi' && (
            <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">
              Hindi
            </span>
          )}
        </div>
      )}
      
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
          {post.title}
        </h2>
        
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center text-sm text-gray-500">
          {post.date && (
            <time dateTime={post.date} className="font-medium">
              {new Date(post.date).toLocaleDateString()}
            </time>
          )}
        </div>
      </div>
    </div>
  </Link>
)

// Tag Archive Page Component
const TagArchive = ({ tag, englishPosts, hindiPosts }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredPosts = filter === 'all' 
    ? [...englishPosts, ...hindiPosts].sort((a, b) => new Date(b.date) - new Date(a.date))
    : filter === 'hindi' 
      ? hindiPosts
      : englishPosts;

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tag: {tag.name}</h1>
        {tag.description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{tag.description}</p>
        )}
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
          onClick={() => setFilter('all')}
        >
          All Posts ({englishPosts.length + hindiPosts.length})
        </button>
        <button 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'english' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
          onClick={() => setFilter('english')}
        >
          English ({englishPosts.length})
        </button>
        <button 
          className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'hindi' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
          onClick={() => setFilter('hindi')}
        >
          Hindi ({hindiPosts.length})
        </button>
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts found with this tag.</p>
          <Link href="/articles" className="text-red-600 hover:underline mt-4 inline-block">
            ← Browse all posts
          </Link>
        </div>
      )}
    </main>
  )
}

// Data fetching functions
const getPostsByTag = async (slug, postType = 'posts') => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/${postType}?_embed=true&tags=${slug}`, {
    next: { revalidate: 3600 }
  })
  const data = await response.json()
  
  return data.map(post => ({
    id: post.id,
    slug: post.slug,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
    date: post.date,
    image_url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    image_alt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
    category: post._embedded?.['wp:term']?.[0]?.[0]?.name || null,
    postType
  }))
}

const getTagDetails = async (slug) => {
  const response = await fetch(`${process.env.BACKEND}/wp-json/wp/v2/tags?slug=${slug}`, {
    next: { revalidate: 3600 }
  })
  const tags = await response.json()
  
  if (!tags.length) return null
  
  return {
    id: tags[0].id,
    name: tags[0].name,
    slug: tags[0].slug,
    description: tags[0].description
  }
}

// Page Component
export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const tag = await getTagDetails(slug);
  
  if (!tag) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tag not found</h1>
        <p>The tag you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/articles" className="text-red-600 hover:underline mt-4 inline-block">
          ← Back to all posts
        </Link>
      </main>
    )
  }

  const englishPosts = await getPostsByTag(tag.id, 'posts');
  const hindiPosts = await getPostsByTag(tag.id, 'hindi');

  return <TagArchive tag={tag} englishPosts={englishPosts} hindiPosts={hindiPosts} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const tag = await getTagDetails(slug);
  
  if (!tag) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.'
    }
  }
  
  return {
    title: `${tag.name} - Tagged Posts`,
    description: tag.description || `Browse all posts tagged with ${tag.name}.`,
    openGraph: {
      title: `${tag.name} - Tagged Posts`,
      description: tag.description || `Browse all posts tagged with ${tag.name}.`,
      type: 'website'
    }
  }
}