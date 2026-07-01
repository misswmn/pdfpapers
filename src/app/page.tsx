import Link from "next/link";
import { Header } from "@/components/header";
import { PaperStack } from "@/components/paper-stack";

const tools = [
  { name: "Graph paper", note: "Squares from 2–20 mm", type: "grid", href: "/generator?type=grid" },
  { name: "Lined paper", note: "Rule it your way", type: "lined", href: "/generator?type=lined" },
  { name: "Dot grid", note: "Quiet structure", type: "dots", href: "/generator?type=dots" },
  { name: "Cornell notes", note: "Remember more", type: "cornell", href: "/generator?type=cornell" },
  { name: "Weekly planner", note: "Seven days, one view", type: "weekly", href: "/generator?type=weekly" },
  { name: "Habit tracker", note: "Build a gentle rhythm", type: "habit", href: "/generator?type=habit" },
];

const bundles = [
  { title: "The Focus Archive", description: "52 pages for deep work, study, and clear thinking.", price: "$8", className: "bundle-blue", labels: ["WEEK 08", "FOCUS", "NOTES"] },
  { title: "Soft Systems", description: "An undated planning ritual in five calm colors.", price: "$6", className: "bundle-coral", labels: ["TODAY", "06:30", "PLAN"] },
  { title: "Academic Field Kit", description: "Cornell, reading logs, essay maps, and revision sheets.", price: "$9", className: "bundle-ink", labels: ["THESIS", "SOURCE", "IDEA"] },
];

const faqs = [
  ["Are the paper generators really free?", "Yes. Every generator is free to customize and download, with no account, watermark, or usage limit."],
  ["How do I print PDF paper at the right size?", "Choose Actual size or 100% in your printer dialog. Turn off Fit to page so millimeter spacing stays precise."],
  ["Can I use these sheets in GoodNotes or Notability?", "Yes. Download the PDF, then import it as a new document or page template in your note-taking app."],
  ["What is included in a premium bundle?", "Each bundle is a coordinated set of printable and tablet-friendly PDFs. The exact page count and formats are listed with every collection."],
];

export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">PAPER, MADE PERSONAL</p>
          <h1>Design your perfect page. <em>Print. Write.</em></h1>
          <p className="hero-lede">Free, precise paper generators for the way you think — plus beautifully made planning systems when you want more.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/generator">Launch free generator <span aria-hidden="true">↗</span></Link>
            <a className="text-link" href="#premium">Explore premium <span aria-hidden="true">↓</span></a>
          </div>
          <p className="quiet-note"><span /> No account. No watermark. Always free.</p>
        </div>
        <PaperStack />
      </section>

      <section className="tool-section" id="generators">
        <div className="shell section-heading">
          <div>
            <p className="eyebrow">FREE GENERATORS</p>
            <h2>Start with a blank page.</h2>
          </div>
          <p>Set the size, spacing, weight, and color. What you see is exactly what lands on the paper.</p>
        </div>
        <div className="shell tool-grid">
          {tools.map((tool, index) => (
            <Link href={tool.href} className={`tool-card pattern-${tool.type}`} key={tool.name}>
              <div className="tool-number">0{index + 1}</div>
              <div className="pattern-preview" aria-hidden="true"><span /></div>
              <div className="tool-meta"><div><h3>{tool.name}</h3><p>{tool.note}</p></div><span className="circle-arrow">↗</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="premium-section" id="premium">
        <div className="shell premium-intro">
          <p className="eyebrow coral">PREMIUM COLLECTIONS</p>
          <h2>Plans with a point<br />of view.</h2>
          <p>For the weeks that need more than a blank page. Thoughtful systems, designed to print beautifully and feel good to use.</p>
        </div>
        <div className="shell bundle-grid">
          {bundles.map((bundle, i) => (
            <article className={`bundle ${bundle.className}`} key={bundle.title}>
              <div className="bundle-art">
                {bundle.labels.map((label, j) => <div className={`mini-sheet sheet-${j}`} key={label}><small>{label}</small><span /><span /><span /></div>)}
                <div className="bundle-index">0{i + 1}</div>
              </div>
              <div className="bundle-copy"><div><h3>{bundle.title}</h3><p>{bundle.description}</p></div><strong>{bundle.price}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="shell how-grid">
          <div className="how-title"><p className="eyebrow">HOW IT WORKS</p><h2>From idea to ink<br />in under a minute.</h2></div>
          <ol>
            <li><span>01</span><div><h3>Choose a format</h3><p>Graph, lined, dots, or Cornell — then pick A4, Letter, A5, or B5.</p></div></li>
            <li><span>02</span><div><h3>Make it yours</h3><p>Adjust spacing, line weight, margins, and one of our print-tested colors.</p></div></li>
            <li><span>03</span><div><h3>Download & print</h3><p>Your vector PDF is made in your browser. Nothing is uploaded or stored.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="faq-section" id="guide">
        <div className="shell faq-grid">
          <div><p className="eyebrow">GOOD TO KNOW</p><h2>Questions,<br /><em>answered.</em></h2></div>
          <div className="faq-list">{faqs.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
        </div>
      </section>

      <footer>
        <div className="shell footer-top"><div className="footer-mark"><span>pdf</span>papers</div><p>Better paper for clearer thinking.</p><Link className="button button-light" href="/generator">Make a page ↗</Link></div>
        <div className="shell footer-bottom"><span>© 2026 pdfpapers</span><nav><a href="#generators">Generators</a><a href="#premium">Premium</a><a href="#guide">Printing guide</a></nav><span>Made for pencils, pens & pixels.</span></div>
      </footer>
    </main>
  );
}
