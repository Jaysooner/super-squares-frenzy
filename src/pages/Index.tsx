
import { useState, useCallback, useEffect } from "react";
import { ChevronDown, Trophy, Users, Football } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Player {
  id: number;
  name: string;
}

interface Square {
  row: number;
  col: number;
  player?: string;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [squares, setSquares] = useState<Square[]>([]);
  const [columnDigits, setColumnDigits] = useState<number[]>(Array(10).fill(-1));
  const [rowDigits, setRowDigits] = useState<number[]>(Array(10).fill(-1));
  const [quarterWinners, setQuarterWinners] = useState<Record<string, string>>({});
  const [selectedQuarter, setSelectedQuarter] = useState("Q1");
  const [scores, setScores] = useState({ chiefs: "", eagles: "" });

  // Initialize squares
  useEffect(() => {
    const initialSquares = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        initialSquares.push({ row: i, col: j });
      }
    }
    setSquares(initialSquares);
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
        [selectedQuarter]: square.player
      }));
      toast.success(`${selectedQuarter} winner: ${square.player}`);
    }
  }, [scores, selectedQuarter, squares, columnDigits, rowDigits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Super Bowl Football Squares
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Add players, claim squares, and track winners for each quarter.
          </p>
        </div>

        {/* Player Management */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Enter player name"
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button
              onClick={addPlayer}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Users className="mr-2 h-4 w-4" />
              Add Player
            </Button>
          </div>
          {players.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {players.map(player => (
                <div
                  key={player.id}
                  className="bg-white/5 px-3 py-1 rounded-full text-sm"
                >
                  {player.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Game Controls */}
        <div className="flex justify-center">
          <Button
            onClick={randomizeNumbers}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Randomize Numbers
          </Button>
        </div>

        {/* Squares Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-lg rounded-lg bg-white/5 backdrop-blur-lg">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    <th className="p-4 text-center">KC vs PHI</th>
                    {columnDigits.map((digit, i) => (
                      <th key={i} className="p-4 text-center border-l border-white/10">
                        Chiefs: {digit === -1 ? "?" : digit}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rowDigits.map((rowDigit, row) => (
                    <tr key={row}>
                      <td className="p-4 text-center border-r border-white/10">
                        Eagles: {rowDigit === -1 ? "?" : rowDigit}
                      </td>
                      {squares
                        .filter(square => square.row === row)
                        .map(square => (
                          <td
                            key={`${square.row}-${square.col}`}
                            className="p-4 text-center border-l border-white/10"
                          >
                            <Select
                              value={square.player}
                              onValueChange={(value) =>
                                assignPlayerToSquare(square.row, square.col, value)
                              }
                            >
                              <SelectTrigger className="w-full bg-white/5 border-white/10">
                                <SelectValue
                                  placeholder={
                                    <span className="text-white/60">Select Player</span>
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {players.map(player => (
                                  <SelectItem key={player.id} value={player.name}>
                                    {player.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quarter Scores */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold">Quarter Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={selectedQuarter}
              onValueChange={setSelectedQuarter}
            >
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
            <Input
              type="number"
              placeholder="Chiefs Score"
              value={scores.chiefs}
              onChange={e => setScores(prev => ({ ...prev, chiefs: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
            />
            <Input
              type="number"
              placeholder="Eagles Score"
              value={scores.eagles}
              onChange={e => setScores(prev => ({ ...prev, eagles: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <Button
            onClick={setQuarterScore}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Football className="mr-2 h-4 w-4" />
            Set Quarter Score
          </Button>

          {/* Quarter Winners Display */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Q1", "Q2", "Q3", "Q4"].map(quarter => (
              <div
                key={quarter}
                className="bg-white/5 rounded-lg p-4 text-center space-y-2"
              >
                <div className="text-sm text-gray-400">{quarter}</div>
                <div className="font-semibold">
                  {quarterWinners[quarter] || "Not Set"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
