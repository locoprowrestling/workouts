import { useApp } from '../context/AppContext';
import QuestCard from '../components/ui/QuestCard';

export default function Quests() {
  const { state } = useApp();
  const weekly = state.quests.filter((q) => q.period === 'weekly');
  const monthly = state.quests.filter((q) => q.period === 'monthly');
  const completedCount = state.completedQuestCount;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quests</h1>
        {completedCount > 0 && (
          <p className="text-sm text-gray-400 mt-1">{completedCount} quest{completedCount !== 1 ? 's' : ''} completed total</p>
        )}
      </div>

      {/* Weekly */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">This Week</h2>
        <div className="flex flex-col gap-3">
          {weekly.map((q) => <QuestCard key={q.id} quest={q} />)}
        </div>
      </div>

      {/* Monthly */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">This Month</h2>
        <div className="flex flex-col gap-3">
          {monthly.map((q) => <QuestCard key={q.id} quest={q} />)}
        </div>
      </div>

      {/* Nutrition tip card */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
        <h3 className="font-semibold text-white mb-2">🥗 Nutrition Reminders</h3>
        <ul className="text-xs text-gray-400 flex flex-col gap-1.5">
          <li>• Protein: 0.8–1g per lb of bodyweight daily</li>
          <li>• Post-workout / pre-bed: Greek yogurt or casein protein shake</li>
          <li>• Shake: casein or pea/rice isolate + oat milk + 1 tbsp peanut butter</li>
          <li>• Pre-workout: banana or toast for quick energy</li>
          <li>• Sleep: 7–9 hours — muscle grows during recovery, not workouts</li>
        </ul>
      </div>
    </div>
  );
}
