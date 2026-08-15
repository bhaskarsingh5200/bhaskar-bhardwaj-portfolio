import { useEffect, useState } from "react";

export function useActiveSection(sectionIds, offset = 120) {
  const [active, setActive] = useState("");
  const ids = sectionIds.join(",");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;

    let observer;
    let mutationObserver;

    const setup = () => {
      observer?.disconnect();

      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (sections.length === 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 }
      );

      sections.forEach((section) => observer.observe(section));
    };

    setup();

    if (typeof MutationObserver !== "undefined") {
      const idSet = new Set(sectionIds);
      mutationObserver = new MutationObserver((records) => {
        const relevant = records.some((record) =>
          Array.from(record.addedNodes).some(
            (node) => node.nodeType === 1 && idSet.has(node.id)
          )
        );
        if (relevant) setup();
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, offset]);

  return active;
}
