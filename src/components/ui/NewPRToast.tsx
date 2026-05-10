import { useEffect } from 'react';

interface Props {
  exerciseName: string;
  weight: number;
  reps: number;
  onDismiss: () => void;
}

export default function NewPRToast({ exerciseName, weight, reps, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="fixed top-6 inset-x-0 flex justify-center z-50 px-6 pointer-events-none">
      <div className="bg-amber-500 text-black font-extrabold text-base px-6 py-4 rounded-2xl shadow-xl animate-bounce">
        New PR! 🏆 {exerciseName} — {weight} lbs × {reps}
      </div>
    </div>
  );
}
