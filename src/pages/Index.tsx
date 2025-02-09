import { useState, useCallback, useEffect } from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NewsTicker from "@/components/NewsTicker";
import { Player, Square, LiveScores, Scores, QuarterWinners } from "@/types/football";
import { PlayerInput } from "@/components/football-squares/PlayerInput";
import { ScoreDisplay } from "@/components/football-squares/ScoreDisplay";
import { SquaresGrid } from "@/components/football-squares/SquaresGrid";
import { QuarterScores } from "@/components/football-squares/QuarterScores";
import { fetchLiveScores } from "@/services/footballService";

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [squares, setSquares] = useState<Square[]>([]);
  const [columnDigits, setColumnDigits] = useState<number[]>(Array(10).fill(-1));
  const [rowDigits, setRowDigits] = useState<number[]>(Array(10).fill(-1));
  const [quarterWinners, setQuarterWinners] = useState<QuarterWinners>({});
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const [scores, setScores] = useState<Scores>({ chiefs: "", eagles: "" });
  const [liveScores, setLiveScores] = useState<LiveScores>({ chiefs: 0, eagles: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialSquares = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        initialSquares.push({ row: i, col: j });
      }
    }
    setSquares(initialSquares);
  }, []);

  const updateLiveScores = async () => {
    setIsLoading(true);
    try {
      const scores = await fetchLiveScores();
      setLiveScores(scores);
      toast.success("Scores updated!");
    } catch (error) {
      console.error('Error fetching scores:', error);
      toast.error("Failed to fetch live scores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateLiveScores();
    const interval = setInterval(updateLiveScores, 60000);
    return () => clearInterval(interval);
  }, []);

  const addPlayer = useCallback(() => {
    if (!newPlayerName.trim()) {
      toast.error("Please enter a player name");
      return;
    }
    setPlayers(prev => [...prev, { id: Date.now(), name: newPlayerName.trim() }]);
    setNewPlayerName("");
    toast.success("Player added successfully!");
  }, [newPlayerName]);

  const assignPlayerToSquare = useCallback((row: number, col: number, playerName: string) => {
    setSquares(prev =>
      prev.map(square =>
        square.row === row && square.col === col
          ? { ...square, player: playerName }
          : square
      )
    );
    toast.success(`Square assigned to ${playerName}`);
  }, []);

  const randomizeNumbers = useCallback(() => {
    const shuffleArray = (array: number[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const numbers = Array.from({ length: 10 }, (_, i) => i);
    setColumnDigits(shuffleArray(numbers));
    setRowDigits(shuffleArray(numbers));
    toast.success("Numbers randomized!");
  }, []);

  const setQuarterScore = useCallback(() => {
    const chiefsScore = parseInt(scores.chiefs);
    const eaglesScore = parseInt(scores.eagles);

    if (isNaN(chiefsScore) || isNaN(eaglesScore)) {
      toast.error("Please enter valid scores");
      return;
    }

    const chiefsDigit = chiefsScore % 10;
    const eaglesDigit = eaglesScore % 10;
    const square = squares.find(
      s => columnDigits[s.col] === chiefsDigit && rowDigits[s.row] === eaglesDigit
    );

    if (square?.player) {
      setQuarterWinners(prev => ({
        ...prev,
        [selectedQuarter]: {
          player: square.player,
          chiefs: scores.chiefs,
          eagles: scores.eagles
        }
      }));
      toast.success(`${selectedQuarter} winner: ${square.player}`);
    } else {
      toast.error("No player found for this square");
    }
  }, [scores, selectedQuarter, squares, columnDigits, rowDigits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <NewsTicker />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Super Bowl Football Squares
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Add players, claim squares, and track winners for each quarter.
            </p>
          </div>

          <PlayerInput
            players={players}
            newPlayerName={newPlayerName}
            setNewPlayerName={setNewPlayerName}
            addPlayer={addPlayer}
          />

          <div className="flex justify-between items-center gap-4">
            <ScoreDisplay liveScores={liveScores} />
            <Button
              onClick={randomizeNumbers}
              className="bg-orange-600 hover:bg-orange-700 flex-shrink-0"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Randomize Numbers
            </Button>
          </div>

          <SquaresGrid
            columnDigits={columnDigits}
            rowDigits={rowDigits}
            squares={squares}
            players={players}
            assignPlayerToSquare={assignPlayerToSquare}
          />

          <QuarterScores
            selectedQuarter={selectedQuarter}
            setSelectedQuarter={setSelectedQuarter}
            scores={scores}
            setScores={setScores}
            setQuarterScore={setQuarterScore}
            quarterWinners={quarterWinners}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
