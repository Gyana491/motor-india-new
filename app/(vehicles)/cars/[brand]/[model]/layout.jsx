import Link from 'next/link';

export default async function ModelLayout({ children, params }) {
  const { brand, model } = await params;

  return (
    <div className="container mx-auto px-4 ">
            <nav className="sticky top-0 bg-white/80 backdrop-blur-md py-4 px-4 -mx-4  border-b overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {[
                  { name: 'Overview', path: '' },
                  { name: 'Variants', path: 'variants' },
                  { name: 'Colors', path: 'colors' },
                  { name: 'Specifications', path: 'specifications' },
                  { name: 'Features', path: 'features' },
                  { name: 'Images', path: 'images' }
                ].map(section => (
                  <Link
                    key={section.path}
                    href={`/cars/${brand}/${model}${section.path ? `/${section.path}` : ''}`}
                    className="px-4 py-2.5 text-center rounded-lg bg-gray-100 hover:bg-red-600  hover:text-white active:bg-red-600  active:text-white transition-colors text-sm md:text-base"
                  >
                    {section.name}
                  </Link>
                ))}
              </div>
            </nav>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}