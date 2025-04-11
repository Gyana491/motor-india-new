"use client";

import { useState } from 'react';

/**
 * A simple ReadMore/ReadLess component that wraps any children content.
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - The content to display.
 * @param {number|string} [props.collapsedHeight=100] - The height (px or CSS value)
 *   of the container when collapsed.
 */
export default function ReadMore({ children, collapsedHeight = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return (
    <div>
      <div
        style={{
          maxHeight: isExpanded ? 'none' : collapsedHeight,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease'
        }}
      >
        {children}
      </div>
      <button onClick={toggleExpanded} className="mt-2 text-blue-600 hover:underline">
        {isExpanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}
