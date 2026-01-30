"use client";

interface University {
  id: number;
  name: string;
  country: string;
  rank: number;
  programs?: string[];
}

export default function UniversityCard({ uni }: { uni: University }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 active:scale-[0.98]">
      {/* Header with Brand Gradient */}
      <div className="h-20 bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
        <h3 className="text-sm font-bold text-white text-center leading-tight relative z-10">
          {uni.name}
        </h3>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.15em]">
            {uni.country}
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Rank #{uni.rank}
          </span>
        </div>
        
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-4">
          Focused on <span className="text-slate-700 font-medium">{uni.programs?.join(', ') || 'Global Studies'}</span>.
        </p>
        
        <button className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-widest border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer">
          University Details
        </button>
      </div>
    </div>
  );
}