
import { LiveScores } from "@/types/football";

interface ScoreDisplayProps {
  liveScores: LiveScores;
}

export const ScoreDisplay = ({ liveScores }: ScoreDisplayProps) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <div className="bg-red-600/20 backdrop-blur-lg rounded-xl p-4 flex-1 text-center">
        <div className="flex items-center justify-center gap-4">
          <img
            src="lovable-uploads/7e47b99c-a255-4a58-8529-23088cc9c4d8.png"
            alt="Chiefs Logo"
            className="w-12 h-12 object-contain opacity-100"
          />
          <div>
            <h3 className="text-lg font-bold">Chiefs</h3>
            <p className="text-3xl font-bold">{liveScores.chiefs}</p>
          </div>
        </div>
      </div>
      <div className="bg-green-600/20 backdrop-blur-lg rounded-xl p-4 flex-1 text-center">
        <div className="flex items-center justify-center gap-4">
          <img
            src="lovable-uploads/b3057b61-455e-4346-b5e6-4b9efbf3eb9e.png"
            alt="Eagles Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h3 className="text-lg font-bold">Eagles</h3>
            <p className="text-3xl font-bold">{liveScores.eagles}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
