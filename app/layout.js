import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/header/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Motor India - Buy & Sell Used Cars and Bikes',
  description: 'India\'s most trusted platform for buying and selling used vehicles. Find the best deals on cars and bikes near you.',
  keywords: 'used cars, used bikes, buy car, sell car, second hand vehicles, used vehicles india',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
