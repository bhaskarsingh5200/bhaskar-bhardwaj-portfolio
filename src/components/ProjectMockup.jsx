const bar = "block rounded-full";
const dark = "bg-[#f2f6fc]";
const darkDim = "bg-white/25";
const light = "bg-[#d4d1c9]";
const gold = "bg-accent";
const ink = "bg-[#1b1b1b]";

function Chrome({ url }) {
  return (
    <div className="flex items-center gap-[5px] border-b border-white/10 bg-[#232220] px-3 py-[0.55rem]">
      <span className="h-[9px] w-[9px] rounded-full bg-[#d9534f]" />
      <span className="h-[9px] w-[9px] rounded-full bg-[#e2a03f]" />
      <span className="h-[9px] w-[9px] rounded-full bg-[#6fae6f]" />
      <span className="ml-1.5 max-w-[150px] flex-1 truncate rounded border border-white/10 bg-[#2a2927] px-2.5 py-[0.22rem] text-[0.62rem] font-medium text-ink-secondary">
        {url}
      </span>
    </div>
  );
}

function GymPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-[#151515]">
      <Chrome url="gym-site.com" />
      <div className="p-[clamp(0.9rem,2vw,1.1rem)]">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded bg-[linear-gradient(135deg,rgb(var(--accent-grad-from)),rgb(var(--accent-grad-to)))]">
            <span className="h-2 w-2 rounded-sm bg-[#151515]" />
          </span>
          <div className="flex items-center gap-2">
            <span className="h-1 w-3.5 rounded bg-white/20" />
            <span className="h-1 w-3.5 rounded bg-white/20" />
            <span className="h-1 w-3.5 rounded bg-white/20" />
            <span className="h-3 w-8 rounded-full bg-accent" />
          </div>
        </div>
        <div className="mb-5 flex flex-col gap-2">
          <span className={`${bar} h-3 w-[60px] rounded-full ${gold}`} />
          <span className={`${bar} h-4 w-[78%] rounded ${dark}`} />
          <span className={`${bar} h-1.5 w-[54%] rounded ${darkDim}`} />
          <div className="mt-1 flex gap-2">
            <span className={`${bar} h-[18px] w-14 rounded ${gold}`} />
            <span className={`${bar} h-[18px] w-14 rounded border border-white/40`} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="h-14 rounded-lg border border-white/10 bg-[#1d1d1c]" />
          <span className="h-14 rounded-lg border border-accent/40 bg-accent/15" />
          <span className="h-14 rounded-lg border border-white/10 bg-[#1d1d1c]" />
        </div>
      </div>
    </div>
  );
}

function FashionPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-[#f6f3ec]">
      <Chrome url="fashionloot.com" />
      <div className="p-[clamp(0.9rem,2vw,1.1rem)]">
        <div className="mb-4 flex items-center justify-between">
          <span className="h-2 w-11 rounded bg-[#1b1b1b]" />
          <div className="flex gap-2">
            <span className="h-1 w-3.5 rounded bg-[#cfccc3]" />
            <span className="h-1 w-3.5 rounded bg-[#cfccc3]" />
            <span className="h-1 w-3.5 rounded bg-[#cfccc3]" />
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center gap-2.5">
          <span className="h-[18px] w-1/2 rounded bg-[#1b1b1b]" />
          <span className="h-[18px] w-16 rounded-full bg-[#1b1b1b]" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            "bg-[linear-gradient(150deg,#d9c8a5,#b9a37c)]",
            "bg-[linear-gradient(150deg,#3a3a3a,#1c1c1c)]",
            "bg-[linear-gradient(150deg,rgb(var(--accent-grad-from)),rgb(var(--accent-grad-to)))]",
            "bg-[linear-gradient(150deg,#8d8d8d,#5a5a5a)]"
          ].map((img, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className={`h-[52px] rounded ${img}`} />
              <span className="h-1 w-[85%] rounded bg-[#d4d1c9]" />
              <span className="h-[5px] w-[55%] rounded bg-[#1b1b1b]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsPreview() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-[#f6f3ec]">
      <Chrome url="thenewsexpress.com" />
      <div className="p-[clamp(0.9rem,2vw,1.1rem)]">
        <div className="mb-4 flex items-center justify-between">
          <span className="h-2.5 w-[72px] rounded bg-[#1b1b1b]" />
          <div className="flex gap-1.5">
            <span className="h-3 w-6 rounded-full bg-[#e4e1d9]" />
            <span className="h-3 w-6 rounded-full bg-[#e4e1d9]" />
            <span className="h-3 w-6 rounded-full bg-[#e4e1d9]" />
          </div>
        </div>
        <div className="mb-4 grid grid-cols-[1.1fr_1fr] gap-2.5">
          <span className="h-[84px] rounded-lg bg-[linear-gradient(135deg,#2b2b2b,#0f0f0f)]" />
          <div className="flex flex-col gap-1.5 py-1">
            <span className="h-2.5 w-10 rounded-full bg-accent" />
            <span className="h-2 w-full rounded bg-[#2a2927]" />
            <span className="h-2 w-[70%] rounded bg-[#2a2927]" />
            <span className="mt-0.5 h-[5px] w-[42%] rounded bg-[#cfccc3]" />
          </div>
        </div>
        <div className="flex flex-col gap-[7px]">
          <span className="h-[22px] rounded border border-black/5 bg-[#f0ede5]" />
          <span className="h-[22px] rounded border border-black/5 bg-[#f0ede5]" />
          <span className="h-[22px] rounded border border-black/5 bg-[#f0ede5]" />
        </div>
      </div>
    </div>
  );
}

function RecipePreview() {
  const stars = "text-[0.56rem] tracking-[1px] text-accent";
  return (
    <div className="overflow-hidden rounded-[10px] border border-line bg-[#f6f3ec]">
      <Chrome url="recipeplatform.com" />
      <div className="p-[clamp(0.9rem,2vw,1.1rem)]">
        <div className="mb-4 flex items-center justify-between">
          <span className="h-2.5 w-14 rounded bg-[#1b1b1b]" />
          <span className="h-5 w-21 rounded-full border border-black/10" />
        </div>
        <div className="mb-4 grid grid-cols-[1.2fr_1fr] gap-2.5">
          <span className="h-[86px] rounded-lg bg-[linear-gradient(135deg,#b98a4b,#6f4a1f)]" />
          <div className="flex flex-col justify-center gap-2">
            <span className="h-2.5 w-[86%] rounded bg-[#2a2927]" />
            <div className="flex items-center gap-2">
              <span className={stars}>★★★★★</span>
              <span className="h-[5px] w-8 rounded bg-[#cfccc3]" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["bg-[linear-gradient(135deg,#d9c8a5,#a3895a)]", "bg-[linear-gradient(135deg,#b5c9a0,#7b9663)]", "bg-[linear-gradient(135deg,#c9a9a0,#96635c)]"].map(
            (img, i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-black/10 bg-white p-1.5">
                <span className={`h-10 rounded ${img}`} />
                <span className="h-1.5 w-4/5 rounded bg-[#2a2927]" />
                <div className="flex items-center gap-1.5">
                  <span className={stars}>{i === 2 ? "★★★★☆" : "★★★★★"}</span>
                  <span className="h-[5px] w-7 rounded bg-[#cfccc3]" />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = {
  gym: GymPreview,
  fashion: FashionPreview,
  news: NewsPreview,
  recipe: RecipePreview
};

export default function ProjectMockup({ variant }) {
  const Preview = PREVIEWS[variant] || GymPreview;
  return <Preview />;
}
