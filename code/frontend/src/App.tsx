import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Range from "./components/Range";
import Devices from "./components/Devices";
import Service from "./components/Service";
import Visit from "./components/Visit";
import { useSmoothScroll } from "./motion";

/**
 * Apple IT — a dark room with one light on each object.
 *
 * The page reads as one film: the curtain lifts off the hero, the category
 * band runs across the join, the five devices stack and hold the screen one at
 * a time, then the counter and the invitation. Lenis carries the scroll.
 */
export default function App() {
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-ground font-body text-ink">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Range />
        <Devices />
        <Service />
      </main>
      <Visit />
    </div>
  );
}
