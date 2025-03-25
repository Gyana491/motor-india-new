import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/assets/motor-india-logo.png"
        alt="Motor India"
        width={180}
        height={40}
        className="w-[160px] md:w-[200px] h-auto"
        priority
      />
    </Link>
  );
};

export default Logo;