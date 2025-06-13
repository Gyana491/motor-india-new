import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/header/Header';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Motor India - India\'s #1 complete Automotive Platform | Car/Bike Research, Pricing & Reviews',
  description: 'India\'s first full-stack automotive platform. Get accurate on-road car prices with our advanced RTO calculator, compare specifications, read expert reviews, and make informed car buying decisions across all Indian states.',
  keywords: 'car prices india, rto calculator, on road price, car specifications, car comparison, new cars india, car reviews, automotive platform, motor india, car buying guide, vehicle research, car features, fuel efficiency, car variants',
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

                {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L3ZNPXHSHV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L3ZNPXHSHV');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        
        <Header />
        {children}
      </body>
    </html>
  );
}
