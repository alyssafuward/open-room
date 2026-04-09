"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function RoomView({ room: initialRoom, onBack }: any) {
  const [room, setRoom] = useState(initialRoom);
  const [objects, setObjects] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('📦');

  useEffect(() => {
    const fetchRoomData = async () => {
      const { data } = await supabase.from('room_objects').select('*').eq('room_id', room.id);
      setObjects(data || []);
    };
    fetchRoomData();

    // Simplify the channel to ensure it catches all relevant changes
    const channel = supabase.channel(`room-${room.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'room_objects'
      }, (payload) => {
        // Only add if it belongs to this room and isn't already in state
        if (payload.new.room_id === room.id) {
          setObjects(prev => {
            if (prev.some(obj => obj.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${room.id}`
      }, (payload) => {
        setRoom(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [room.id]);

  const addObject = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id !== 'room-floor') return;

    const newObj = { 
      type: selectedType, 
      x: e.clientX - 25, 
      y: e.clientY - 25, 
      room_id: room.id 
    };

    // 1. Optimistic Update: Show it immediately locally so it doesn't "disappear"
    const tempId = Math.random().toString();
    setObjects(prev => [...prev, { ...newObj, id: tempId }]);

    // 2. Save to Database
    const { error } = await supabase.from('room_objects').insert([newObj]);
    
    if (error) {
      console.error("Placement error:", error);
      // Remove the fake item if the save failed
      setObjects(prev => prev.filter(obj => obj.id !== tempId));
    }
  };

  // --- RENAME FUNCTION ---
  const renameRoom = async () => {
    const newName = prompt("Enter new room name:", room.name);
    if (!newName || newName.trim() === "" || newName === room.name) return;

    const { data } = await supabase.from('rooms').update({ name: newName.trim() }).eq('id', room.id).select();
    if (data && data.length > 0) setRoom(data[0]);
  };

  return (
    <main id="room-floor" className="h-screen w-screen bg-slate-50 relative overflow-hidden cursor-crosshair" onClick={addObject}>
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 pointer-events-none">
        <button onClick={onBack} className="text-indigo-600 font-bold hover:underline pointer-events-auto">← Exit to Neighborhood</button>
        
        <div className="flex items-center gap-3 mt-2 pointer-events-auto">
          <h1 className="text-4xl font-black tracking-tight">{room.name}</h1>
          <button onClick={renameRoom} className="p-2 hover:bg-slate-200 rounded-full transition-colors">✏️</button>
        </div>
        
        <p className="text-slate-500 font-medium text-sm">Built by {room.owner_name}</p>
        
        <div className="mt-6 flex gap-3 pointer-events-auto">
          {['📦', '🌲', '🛋️', '🐈', '✨', '🏮'].map(item => (
            <button 
              key={item} 
              onClick={() => setSelectedType(item)} 
              className={`w-14 h-14 text-2xl rounded-xl border-2 transition-all ${
                selectedType === item ? 'border-indigo-500 bg-indigo-50 scale-110 shadow-md' : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Render Objects */}
      {objects.map(obj => (
        <div key={obj.id} className="absolute text-5xl select-none pointer-events-none" style={{ left: obj.x, top: obj.y }}>
          {obj.type}
        </div>
      ))}
    </main>
  );
}