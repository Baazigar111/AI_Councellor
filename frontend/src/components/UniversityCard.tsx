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
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-all shadow-lg group">
      {/* Updated to bg-linear-to-br as per Tailwind v4 suggestions */}
      <div className="h-24 bg-linear-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <h3 className="text-md font-bold text-white text-center leading-tight">
          {uni.name}
        </h3>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            {uni.country}
          </span>
          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
            Rank #{uni.rank}
          </span>
        </div>
        
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          Specializes in {uni.programs?.join(', ') || 'Global Studies'}.
        </p>
        
        <button className="w-full py-2 rounded-lg bg-slate-700 text-[11px] font-bold uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
          University Details
        </button>
      </div>
    </div>
  );
}