import Link from "next/link";

export function Header() {
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="brand" aria-label="pdfpapers home"><span>pdf</span>papers<i /></Link>
    <nav className="desktop-nav"><Link href="/#generators">Generators</Link><Link href="/#premium">Premium</Link><Link href="/#guide">Printing guide</Link></nav>
    <Link href="/generator" className="header-cta">Make a page <span>↗</span></Link>
  </div></header>;
}
