const Navigation = ({ isMobile }) => {
  const menuItems = [
    { label: 'Cars', href: '/cars' },
    {label:'Posts', href: '/post'},
  ];

  return (
    <nav className={`${isMobile ? 'flex flex-col space-y-4' : 'flex items-center space-x-8'} py-3`}>
      {menuItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors
            ${isMobile ? 'block w-full py-2' : ''}`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation; 