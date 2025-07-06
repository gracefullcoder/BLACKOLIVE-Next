import Link from 'next/link';
import { Instagram, Facebook, MessageCircle } from 'lucide-react'; // Importing Lucide icons

function Footer() {
  return (
    <footer className="bg-black pt-12 px-6 md:px-12 lg:px-40 relative">
      <div className="font-bold text-xl text-slate-400 text-center mb-8">
        BLACK OLIVE
      </div>

      <ul className="flex text-sm text-slate-400 font-medium gap-4 justify-center max-sm:flex-col items-center">
        <li><Link href="/about">ABOUT US</Link></li>
        <li><Link href="/shipping">SHIPPING POLICY</Link></li>
        <li><Link href="/terms">TERMS & CONDITION</Link></li>
        <li><Link href="/policy">PRIVACY POLICY</Link></li>
        <li><Link href="/contact">CONTACT US</Link></li>
      </ul>

      <div className="flex gap-4 my-6 text-center items-center justify-center">
        <p className="font-bold text-xl text-slate-400 text-center">
          Follow Us On
        </p>
        <div className="flex gap-2 justify-center">
          <a href="https://www.instagram.com/black.olive._?igsh=em9lYXMydW40bHR6" target='_blank'>
            <Instagram className="h-8 w-8 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer" />
          </a>
          <a href="https://www.facebook.com/blackoIive0123" target='_blank'>
            <Facebook className="h-8 w-8 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer" />
          </a>
          <a href="https://wa.me/+917211166616" target='_blank'>
            <MessageCircle className="h-8 w-8 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer" />
          </a>
        </div>
      </div>

      <div className="mt-8 text-sm text-slate-400 font-medium gap-1 flex flex-wrap justify-center">
        <p>
          © 2024 BLACK OLIVE, Website Developed by
        </p>
        <p className='font-bold'>
          <a href="https://github.com/gracefullcoder" target='blank'>
            Vaibhav Gupta
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
