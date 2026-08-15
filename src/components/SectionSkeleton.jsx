export default function SectionSkeleton() {
  return (
    <div className="section" aria-hidden="true">
      <div className="shell">
        <div className="skeleton mb-4 h-5 w-24 rounded-full" />
        <div className="skeleton mb-10 h-12 w-full max-w-md rounded-[12px]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-56 rounded-card" />
          <div className="skeleton h-56 rounded-card" />
          <div className="skeleton h-56 rounded-card" />
        </div>
      </div>
    </div>
  );
}
