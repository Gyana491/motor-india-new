'use client';

import Link from "next/link"
import Image from "next/image"
import { useState } from 'react'

// Post Card Component
const PostCard = ({ post }) => (
  <Link 
    href={`/${post.postType === 'hindi' ? 'hindi' : 'articles'}/${post.slug}`}
    className="group block h-full"
  >
    <article className="bg-white h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 backdrop-blur-sm">
      {post.image_url && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.image_url}
            alt={post.image_alt || post.title}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4 flex gap-2 items-center">
            {post.category && (
              <span className="bg-red-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                {post.category}
              </span>
            )}
            {post.postType === 'hindi' && (
              <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                Hindi
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-3 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h2>
        
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center text-sm text-gray-500">
          {post.date && (
            <time dateTime={post.date} className="font-medium">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          )}
        </div>
      </div>
    </article>
  </Link>
)

// Tag Archive Component
export default function TagArchive({ tag, englishPosts, hindiPosts }) {
  const [filter, setFilter] = useState('all');
  
  const filteredPosts = filter === 'all' 
    ? [...englishPosts, ...hindiPosts].sort((a, b) => new Date(b.date) - new Date(a.date))
    : filter === 'hindi' 
      ? hindiPosts
      : englishPosts;

  return (
    <main className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
          {tag.name}
        </h1>
        {tag.description && (
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{tag.description}</p>
        )}
      </div>

      <div className="flex justify-center gap-3 mb-12">
        <button 
          className={`px-8 py-2.5 rounded-full font-medium transition-all duration-300 ${filter === 'all' 
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20 scale-105' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-red-200'}`}
          onClick={() => setFilter('all')}
        >
          All Posts ({englishPosts.length + hindiPosts.length})
        </button>
        <button 
          className={`px-8 py-2.5 rounded-full font-medium transition-all duration-300 ${filter === 'english' 
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20 scale-105' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-red-200'}`}
          onClick={() => setFilter('english')}
        >
          English ({englishPosts.length})
        </button>
        <button 
          className={`px-8 py-2.5 rounded-full font-medium transition-all duration-300 ${filter === 'hindi' 
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20 scale-105' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-red-200'}`}
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
        <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-gray-100">
          <p className="text-gray-600 text-lg mb-4">No posts found with this tag.</p>
          <Link 
            href="/articles" 
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse all posts
          </Link>
        </div>
      )}
    </main>
  )
}