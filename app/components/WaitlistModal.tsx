'use client';

const WAITLIST = [
  { position: 1,  initials: 'OO' },
  { position: 2,  initials: 'BN' },
  { position: 3,  initials: 'OT' },
  { position: 4,  initials: 'TF' },
  { position: 5,  initials: 'DIK' },
  { position: 6,  initials: 'BM' },
  { position: 7,  initials: 'NW' },
  { position: 8,  initials: 'TL' },
  { position: 9,  initials: 'ED' },
  { position: 10, initials: 'ST' },
  { position: 11, initials: 'EP' },
  { position: 12, initials: 'XT' },
  { position: 13, initials: 'BX' }    
];

export default function WaitlistModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-xs w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-slate-900 text-xl font-black tracking-tight mb-5">List</h2>
        <ol className="space-y-2">
          {WAITLIST.map(({ position, initials }) => (
            <li key={position} className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-300 w-5 text-right">{position}</span>
              <span className="text-sm font-mono font-bold text-slate-700">{initials}</span>
            </li>
          ))}
        </ol>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
