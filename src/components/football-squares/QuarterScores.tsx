
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { QuarterWinners, Scores } from "@/types/football";

interface QuarterScoresProps {
  selectedQuarter: string;
  setSelectedQuarter: (quarter: string) => void;
  scores: Scores;
  setScores: React.Dispatch<React.SetStateAction<Scores>>;
  setQuarterScore: () => void;
  quarterWinners: QuarterWinners;
}

export const QuarterScores = ({
  selectedQuarter,
  setSelectedQuarter,
  scores,
  setScores,
  setQuarterScore,
  quarterWinners,
}: QuarterScoresProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-semibold">Quarter Scores</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
          <SelectTrigger className="w-full bg-white/5 border-white/10">
            <SelectValue placeholder="Select Quarter" />
          </SelectTrigger>
          <SelectContent>
            {["Q1", "Q2", "Q3", "Q4"].map(quarter => (
              <SelectItem key={quarter} value={quarter}>
                {quarter}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative">
          <Input
            type="number"
            placeholder="Chiefs Score"
            value={scores.chiefs}
            onChange={e => setScores({ ...scores, chiefs: e.target.value })}
            className="bg-white/5 border-white/10 text-white pl-12"
          />
          <img
            src="lovable-uploads/7e47b99c-a255-4a58-8529-23088cc9c4d8.png"
            alt="Chiefs Logo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 object-contain"
          />
        </div>
        <div className="relative">
          <Input
            type="number"
            placeholder="Eagles Score"
            value={scores.eagles}
            onChange={e => setScores({ ...scores, eagles: e.target.value })}
            className="bg-white/5 border-white/10 text-white pl-12"
          />
          <img
            src="lovable-uploads/b3057b61-455e-4346-b5e6-4b9efbf3eb9e.png"
            alt="Eagles Logo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 object-contain"
          />
        </div>
      </div>
      <Button onClick={setQuarterScore} className="w-full bg-purple-600 hover:bg-purple-700">
        <Trophy className="mr-2 h-4 w-4" />
        Set Quarter Score
      </Button>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Q1", "Q2", "Q3", "Q4"].map(quarter => (
          <div key={quarter} className="bg-white/5 rounded-lg p-4 text-center space-y-2">
            <div className="text-sm text-gray-400">{quarter}</div>
            <div className="font-semibold">{quarterWinners[quarter] || "Not Set"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
