import React, { useEffect, useRef, useState } from "react";
import HeroContent from "../Admin/HeroContent/HeroContent";
import Members from "../Admin/Members/Members";

const TABS = [
  "People",
  "Hero content",
  "Upcoming Events",
  "Messages",
  "FAQs",
  "Core Areas",
  "Gallery",
  "Events",
];

const DashboardNavbar: React.FC = () => {
  // store index instead of string to make keyboard navigation simpler
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>(
    []
  ) as React.MutableRefObject<Array<HTMLButtonElement | null>>;

  useEffect(() => {
    // ensure there is always a focused tab element available after mount
    if (!tabsRef.current[activeIndex]) return;
  }, [activeIndex]);

  const focusTab = (index: number) => {
    const el = tabsRef.current[index];
    if (el) el.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = TABS.length - 1;
    if (e.key === "ArrowRight") {
      const next = index === last ? 0 : index + 1;
      setActiveIndex(next);
      focusTab(next);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      const prev = index === 0 ? last : index - 1;
      setActiveIndex(prev);
      focusTab(prev);
      e.preventDefault();
    } else if (e.key === "Home") {
      setActiveIndex(0);
      focusTab(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setActiveIndex(last);
      focusTab(last);
      e.preventDefault();
    }
  };

  return (
    <nav className="w-full mt-4">
      {/* Small screens: accessible select for overflow */}
      <div className="sm:hidden mb-2">
        <label htmlFor="dashboard-select" className="sr-only">
          Select panel
        </label>
        <select
          id="dashboard-select"
          className="select w-full"
          value={activeIndex}
          onChange={(e) => setActiveIndex(Number(e.target.value))}
          aria-label="Select dashboard panel"
        >
          {TABS.map((t, i) => (
            <option key={t} value={i}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block overflow-x-auto no-scrollbar">
        <ul
          role="tablist"
          aria-label="Dashboard sections"
          className="menu menu-horizontal px-2 py-1 gap-2"
        >
          {TABS.map((t, i) => {
            const isActive = i === activeIndex;
            return (
              <li
                key={t}
                className={isActive ? "bg-primary text-white rounded-md" : ""}
              >
                <button
                  ref={(el) => {
                    tabsRef.current[i] = el;
                  }}
                  role="tab"
                  id={`dashboard-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls={`dashboard-panel-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    isActive ? "font-medium" : ""
                  }`}
                  onClick={() => setActiveIndex(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  {t}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4">
        <div
          className="bg-base-100 border border-base-200 rounded-md p-6 shadow-sm"
          role="region"
          aria-labelledby={`dashboard-tab-${activeIndex}`}
          id={`dashboard-panel-${activeIndex}`}
        >
          {TABS[activeIndex] === "People" && <Members />}
          {TABS[activeIndex] === "Hero content" && <HeroContent />}
          {/* Fallback simple content for other sections while expanding panels */}
          {!["People", "Hero content"].includes(TABS[activeIndex]) && (
            <div>
              <h3 className="text-lg font-semibold">{TABS[activeIndex]}</h3>
              <div className="mt-3 text-sm text-base-content/70">
                Content for <strong>{TABS[activeIndex]}</strong> goes here.
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
