export function PartnerLogos() {
  return (
    <div className="flex items-center gap-6">
      {/* Base logo */}
      <div className="relative group">
        <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur shadow-md border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer card-3d">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <span className="text-sm font-semibold text-slate-700">Base</span>
        </div>
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
      </div>

      {/* Farcaster logo */}
      <div className="relative group">
        <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur shadow-md border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer card-3d">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200/50 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h10v2H7V9zm0 4h6v2H7v-2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-700">Farcaster</span>
        </div>
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-400 to-purple-600 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
      </div>
    </div>
  )
}
