"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type CategoryId =
  | "profession"
  | "adhd"
  | "teacher"
  | "budget"
  | "student"
  | "meal"
  | "planner";

type Category = {
  id: CategoryId;
  name: string;
  tag: string;
  demand: "Very high" | "High" | "Medium";
  competition: "Low" | "Medium" | "High" | "Very high";
  margin: "High" | "Medium" | "Low";
  verdict: "Best" | "Strong" | "Watch";
  why: string;
  buyer: string;
  price: string;
  moat: string;
  firstProducts: string[];
  competitorPattern: string;
};

const categories: Category[] = [
  {
    id: "profession",
    name: "Specific professional tools",
    tag: "Best first lane",
    demand: "High",
    competition: "Medium",
    margin: "High",
    verdict: "Best",
    why: "Nurses, trainers, and coaches buy for workflow speed, not decoration. That usually supports higher prices and stronger repeat bundles.",
    buyer: "Professionals who need tracking, notes, scheduling, or handoff templates.",
    price: "$7.99-$24.99",
    moat: "Win by understanding one job deeply and shipping a complete workflow kit.",
    firstProducts: ["Nurse shift sheet", "Client progress tracker", "Session notes dashboard"],
    competitorPattern: "Many listings are generic; the best ones are built around a single profession and a very specific pain point.",
  },
  {
    id: "adhd",
    name: "ADHD / mental health planners",
    tag: "Best first lane",
    demand: "Very high",
    competition: "Medium",
    margin: "High",
    verdict: "Best",
    why: "This category sells the promise of lower friction and better follow-through. That emotional payoff supports premium pricing when the product feels truly usable.",
    buyer: "Neurodivergent users, overwhelm-prone planners, and people who want fewer choices.",
    price: "$4.99-$29.99",
    moat: "Design for executive dysfunction: fewer decisions, clearer sequence, more encouragement.",
    firstProducts: ["ADHD daily planner", "Brain dump sheet", "Reward / routine system"],
    competitorPattern: "The strongest products keep the layout clean and the language supportive; weaker ones just repaint a normal planner.",
  },
  {
    id: "teacher",
    name: "Teacher resource packs",
    tag: "Strong lane",
    demand: "High",
    competition: "High",
    margin: "High",
    verdict: "Strong",
    why: "Teachers pay for time savings. If you solve lesson planning, grading, or classroom organization, bundles can price well.",
    buyer: "Teachers, homeschool parents, substitute teachers, and curriculum planners.",
    price: "$6.99-$34.99",
    moat: "Segment by grade, subject, and classroom context instead of making one generic teacher planner.",
    firstProducts: ["Lesson planner", "Grade tracker", "Homeschool weekly kit"],
    competitorPattern: "Most competitors bundle a lot; the opportunity is in sharper structure and clearer use cases.",
  },
  {
    id: "budget",
    name: "Budget / finance planners",
    tag: "Strong lane",
    demand: "Very high",
    competition: "High",
    margin: "High",
    verdict: "Strong",
    why: "Budget templates are always searched, but the basic versions are crowded and cheap. The money is in a narrowly defined financial scenario.",
    buyer: "Families, couples, students, debt payers, and paycheck-to-paycheck users.",
    price: "$3.99-$19.99",
    moat: "Wrap the tool around debt snowball, sinking funds, or biweekly pay cycles.",
    firstProducts: ["Zero-based budget", "Debt snowball tracker", "Couples finance system"],
    competitorPattern: "A lot of listings are simple spreadsheets; the better ones create a full decision system around money habits.",
  },
  {
    id: "student",
    name: "Student academic kits",
    tag: "Watch closely",
    demand: "High",
    competition: "High",
    margin: "Medium",
    verdict: "Watch",
    why: "Seasonal demand is real, especially around back-to-school, but broad student planners are crowded. Specific academic pain points perform better.",
    buyer: "College students, grad students, transfer students, and exam-heavy programs.",
    price: "$2.99-$14.99",
    moat: "Use school-specific workflows: GPA, deadlines, assignments, and thesis timelines.",
    firstProducts: ["GPA tracker", "Assignment planner", "Thesis timeline"],
    competitorPattern: "The market is full of general planner bundles, so sharper school-level specificity matters.",
  },
  {
    id: "meal",
    name: "Meal planning bundles",
    tag: "Watch closely",
    demand: "High",
    competition: "High",
    margin: "Medium",
    verdict: "Watch",
    why: "The need is stable, but buyers often expect a low price unless the product saves a lot of time or links to grocery automation.",
    buyer: "Families, busy professionals, fitness users, and ADHD users trying to reduce meal friction.",
    price: "$1.99-$12.99",
    moat: "Bundle menu, grocery list, macros, and inventory into one easy system.",
    firstProducts: ["Weekly meal planner", "Grocery list tracker", "Macro meal planner"],
    competitorPattern: "Most competitors sell a single meal sheet; the stronger listings combine planning with shopping and prep.",
  },
  {
    id: "planner",
    name: "Generic weekly planners",
    tag: "Do not lead with this",
    demand: "Very high",
    competition: "Very high",
    margin: "Low",
    verdict: "Watch",
    why: "This is the easiest thing to search and the hardest thing to win. It works as an entry product, not a core strategy.",
    buyer: "Broad audience with weak intent and many alternatives.",
    price: "$0.99-$4.99",
    moat: "Only works when it is strongly designed for a niche or a visual identity.",
    firstProducts: ["Undated weekly planner", "Minimal daily planner", "Time-blocking sheet"],
    competitorPattern: "Search results are dense with very similar products, often priced aggressively low.",
  },
];

const priorityOrder: CategoryId[] = ["profession", "adhd", "teacher", "budget", "student", "meal", "planner"];

const launchPlan = [
  {
    step: "Week 1",
    title: "Pick one lane and one buyer",
    description: "Choose a single niche and one concrete use case. Do not launch a generic template first.",
  },
  {
    step: "Week 2",
    title: "Build the core bundle",
    description: "Ship 3-5 coordinated templates that solve one workflow end-to-end, not just a prettier sheet.",
  },
  {
    step: "Week 3",
    title: "Write for Etsy search intent",
    description: "Title the listing around the pain point, the profession, and the file type. Keep the language natural.",
  },
  {
    step: "Week 4",
    title: "Launch and iterate",
    description: "Publish one lead product, one mid-priced bundle, and one low-price entry item. Then improve based on clicks and saves.",
  },
];

const scoreCopy = {
  demand: {
    "Very high": "Demand is broad and persistent.",
    High: "Demand is proven and healthy.",
    Medium: "Demand exists, but you need sharper positioning.",
  },
  competition: {
    Low: "You can still carve out space.",
    Medium: "You need a clear angle to win.",
    High: "Expect strong competition and sharper execution.",
    "Very high": "Treat as an entry point only.",
  },
  margin: {
    High: "Strong room for premium bundles.",
    Medium: "Works best with add-ons and upsells.",
    Low: "Price pressure is likely.",
  },
};

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="strategy-pill">{children}</span>;
}

export function EtsyStrategyWorkspace() {
  const [activeId, setActiveId] = useState<CategoryId>("profession");
  const active = useMemo(() => categories.find((item) => item.id === activeId) ?? categories[0], [activeId]);

  return (
    <div className="etsy-workspace">
      <section className="strategy-hero">
        <div>
          <p className="eyebrow coral">ETSY NICHES · LAUNCH PLAN</p>
          <h1>Pick a niche with room to win.</h1>
          <p className="strategy-lede">
            This board turns the category analysis into a practical launch system: where demand is strong,
            where competition is survivable, and what to ship first.
          </p>
        </div>
        <div className="strategy-summary">
          <div>
            <span>Primary recommendation</span>
            <strong>Specific professional tools</strong>
          </div>
          <div>
            <span>Best growth bet</span>
            <strong>ADHD / mental health planners</strong>
          </div>
          <div>
            <span>Safe secondary lane</span>
            <strong>Teacher resource packs</strong>
          </div>
        </div>
      </section>

      <section className="strategy-kpis">
        <article>
          <span>Why this works</span>
          <p>Generic planners are crowded. Niche workflows let you charge more because the buyer sees faster results.</p>
        </article>
        <article>
          <span>Winning formula</span>
          <p>One buyer, one pain point, one complete system, then a bundle and an entry product.</p>
        </article>
        <article>
          <span>Best structure</span>
          <p>Ship a lead product, a mid-priced pack, and a premium bundle so you capture different intents.</p>
        </article>
      </section>

      <section className="strategy-board">
        <div className="strategy-board-head">
          <div>
            <p className="eyebrow">CATEGORY PRIORITY</p>
            <h2>Ranked by demand, competition, and margin.</h2>
          </div>
          <p>Use the tabs to inspect each category the same way a buyer would evaluate it on Etsy.</p>
        </div>

        <div className="strategy-layout">
          <div className="strategy-tabs" role="tablist" aria-label="Etsy categories">
            {priorityOrder.map((id, index) => {
              const item = categories.find((entry) => entry.id === id)!;
              const activeTab = activeId === id;

              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab}
                  className={`strategy-tab ${activeTab ? "active" : ""}`}
                  onClick={() => setActiveId(id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.name}</strong>
                  <small>{item.tag}</small>
                </button>
              );
            })}
          </div>

          <article className="strategy-panel" aria-live="polite">
            <div className="strategy-panel-top">
              <div>
                <Pill>{active.tag}</Pill>
                <h3>{active.name}</h3>
              </div>
              <strong className="strategy-verdict">{active.verdict}</strong>
            </div>

            <p className="strategy-panel-copy">{active.why}</p>

            <div className="strategy-metrics">
              <div>
                <span>Demand</span>
                <strong>{active.demand}</strong>
                <small>{scoreCopy.demand[active.demand]}</small>
              </div>
              <div>
                <span>Competition</span>
                <strong>{active.competition}</strong>
                <small>{scoreCopy.competition[active.competition]}</small>
              </div>
              <div>
                <span>Margin</span>
                <strong>{active.margin}</strong>
                <small>{scoreCopy.margin[active.margin]}</small>
              </div>
            </div>

            <div className="strategy-meta-grid">
              <div>
                <span>Buyer</span>
                <p>{active.buyer}</p>
              </div>
              <div>
                <span>Price band</span>
                <p>{active.price}</p>
              </div>
              <div>
                <span>Competitive moat</span>
                <p>{active.moat}</p>
              </div>
              <div>
                <span>Competitor pattern</span>
                <p>{active.competitorPattern}</p>
              </div>
            </div>

            <div className="strategy-products">
              <h4>Ship these first</h4>
              <ul>
                {active.firstProducts.map((product) => (
                  <li key={product}>{product}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="strategy-row">
        <article className="strategy-card strategy-card-accent">
          <p className="eyebrow">RECOMMENDED STACK</p>
          <h2>Best launch sequence</h2>
          <ol>
            <li>
              <strong>Lead product</strong>
              <span>One focused template that solves a single job fast.</span>
            </li>
            <li>
              <strong>Bundle</strong>
              <span>Three to five coordinated files with related jobs.</span>
            </li>
            <li>
              <strong>Entry item</strong>
              <span>A low-price item that gets clicks and feed traffic.</span>
            </li>
          </ol>
        </article>

        <article className="strategy-card">
          <p className="eyebrow">30-DAY PLAN</p>
          <h2>From idea to first listing</h2>
          <div className="launch-plan">
            {launchPlan.map((item) => (
              <div key={item.step}>
                <span>{item.step}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="strategy-footer">
        <div>
          <p className="eyebrow">NEXT MOVE</p>
          <h2>Turn the chosen niche into a real product line.</h2>
          <p>
            The fastest path is to build one niche deeply, then add adjacent tools instead of jumping to a
            second unrelated market.
          </p>
        </div>
        <div className="strategy-footer-actions">
          <Link className="button button-primary" href="/studio">
            Build a printable system <span aria-hidden="true">↗</span>
          </Link>
          <Link className="button button-light" href="/generator">
            Use the free generator <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
