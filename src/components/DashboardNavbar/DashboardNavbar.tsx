import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import HeroContent from "../Admin/HeroContent/HeroContent";
import Members from "../Admin/Members/Members";
import EventsForm from "../Admin/EventsForm/EventsForm";
import AllDashbordEvents from "../Admin/AllDashbordEvents/AllDashbordEvents";
import AdminFAQs from "../Admin/AdminFAQs/AdminFAQs";
import AdminGallery from "../Admin/AdminGallery/AdminGallery";

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

// URL query format examples:
// ?tab=people
// ?tab=hero-content
// ?tab=upcoming-events
// ?tab=messages
// ?tab=faqs
// ?tab=core-areas
// ?tab=gallery
// ?tab=events

const DashboardNavbar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabsRef = useRef<Array<HTMLButtonElement | null>>(
    []
  ) as React.MutableRefObject<Array<HTMLButtonElement | null>>;

  // Get initial active index from URL query parameter or default to 0
  const getInitialActiveIndex = (): number => {
    const tabQuery = searchParams.get("tab");
    if (tabQuery) {
      const index = TABS.findIndex(
        (tab) =>
          tab.toLowerCase().replace(/\s+/g, "-") === tabQuery.toLowerCase()
      );
      return index !== -1 ? index : 0;
    }
    return 0;
  };

  const [activeIndex, setActiveIndex] = useState<number>(getInitialActiveIndex);

  // Convert tab name to URL-friendly format
  const getTabSlug = (tabName: string): string => {
    return tabName.toLowerCase().replace(/\s+/g, "-");
  };

  // Update URL when active index changes
  const updateActiveIndex = (index: number) => {
    setActiveIndex(index);
    const tabSlug = getTabSlug(TABS[index]);
    setSearchParams({ tab: tabSlug }, { replace: true });
  };

  useEffect(() => {
    // Sync with URL on initial load and when URL changes
    const newIndex = getInitialActiveIndex();
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      updateActiveIndex(next);
      focusTab(next);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      const prev = index === 0 ? last : index - 1;
      updateActiveIndex(prev);
      focusTab(prev);
      e.preventDefault();
    } else if (e.key === "Home") {
      updateActiveIndex(0);
      focusTab(0);
      e.preventDefault();
    } else if (e.key === "End") {
      updateActiveIndex(last);
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
          onChange={(e) => updateActiveIndex(Number(e.target.value))}
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
                  onClick={() => updateActiveIndex(i)}
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
          {TABS[activeIndex] === "Upcoming Events" && <EventsForm />}
          {TABS[activeIndex] === "Events" && <AllDashbordEvents />}
          {/* Fallback simple content for other sections while expanding panels */}
          {TABS[activeIndex] === "FAQs" && <AdminFAQs />}
          {TABS[activeIndex] === "Gallery" && <AdminGallery />}
          {![
            "People",
            "Hero content",
            "Upcoming Events",
            "Events",
            "FAQs",
            "Gallery",
          ].includes(TABS[activeIndex]) && (
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
