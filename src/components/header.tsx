import Link from "next/link";

export function Header() {
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="brand" aria-label="pdfpapers home"><span>pdf</span>papers<i /></Link>
    <nav className="desktop-nav"><Link href="/studio">Personal studio</Link><Link href="/#generators">Generators</Link><Link href="/#premium">Collections</Link></nav>
    <Link href="/studio" className="header-cta">Make it yours <span>↗</span></Link>
  </div></header>;
}
