export function LegalSourceLink({
  citation,
  url,
  className = "",
}: {
  citation: string;
  url?: string | null;
  className?: string;
}) {
  if (!url) {
    return <span className={`font-medium text-slate-800 ${className}`}>{citation}</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-0.5 font-medium text-blue-600 underline-offset-2 hover:underline ${className}`}
    >
      {citation}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

export function LegalSourcesFooter() {
  const links = [
    { label: "Rules of the Small Claims Court",  url: "https://www.ontario.ca/laws/regulation/980258" },
    { label: "Courts of Justice Act",             url: "https://www.ontario.ca/laws/statute/90c43" },
    { label: "Sale of Goods Act",                 url: "https://www.ontario.ca/laws/statute/90s01" },
    { label: "Consumer Protection Act",           url: "https://www.ontario.ca/laws/statute/02c30" },
    { label: "Employment Standards Act",          url: "https://www.ontario.ca/laws/statute/00e41" },
    { label: "Canada Justice Laws",               url: "https://laws-lois.justice.gc.ca/eng/" },
  ];
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Primary Sources
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-600 hover:underline"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
