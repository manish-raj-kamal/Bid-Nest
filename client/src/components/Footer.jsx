import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const footerLinks = {
  'Quick Links': ['Home', 'Auctions', 'Categories', 'How It Works', 'Blog'],
  'Categories': ['Electronics', 'Vehicles', 'Real Estate', 'Art', 'Jewelry'],
  'Support': ['Help Center', 'Terms of Service', 'Privacy Policy', 'Contact Us', 'FAQ'],
};

/* Inline SVG social icons — lucide-react doesn't include brand icons */
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
);
const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>
  </svg>
);

const socialIcons = [
  { icon: FacebookIcon, href: '#' },
  { icon: TwitterIcon, href: '#' },
  { icon: InstagramIcon, href: '#' },
  { icon: LinkedinIcon, href: '#' },
  { icon: YoutubeIcon, href: '#' },
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setNewsletterMessage('Thanks, we will send auction updates soon.');
    setEmail('');
  };

  return (
    <footer id="contact" className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L8 16H14V28L24 16H18V4Z" fill="white" />
                </svg>
              </div>
              <span className="text-lg font-bold text-text-primary tracking-tight">
                Bid<span className="text-accent">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
              The premium curated auction platform where quality meets competition. Experience luxury bidding at its finest.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialIcons.map(({ icon: Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(event) => event.preventDefault()}
                  title="Social profile coming soon"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-secondary text-text-secondary transition-all duration-300 hover:bg-accent hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-2">
              <h4 className="font-semibold text-sm text-text-primary mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-text-secondary hover:text-accent transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-sm text-text-primary mb-5">Newsletter</h4>
            <p className="text-sm text-text-secondary mb-4">
              Stay updated with premium auctions and exclusive deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                required
                className="min-h-10 flex-1 rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm placeholder:text-text-secondary/50 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-dark"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
            {newsletterMessage && (
              <p className="mt-3 text-xs font-medium text-accent">{newsletterMessage}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} BidNest. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-text-secondary hover:text-accent transition-colors">
              Terms
            </a>
            <a href="#" className="text-xs text-text-secondary hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-text-secondary hover:text-accent transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
