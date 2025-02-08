import { useState, useCallback, useEffect } from "react";
import { ChevronDown, Trophy, Users } from "lucide-react";
import NewsTicker from "@/components/NewsTicker";
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

interface LiveScore {
  teamName: string;
  score: number;
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
  const [liveScores, setLiveScores] = useState<{ chiefs: number; eagles: number }>({ chiefs: 0, eagles: 0 });
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

  const fetchLiveScores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLScoresOnly?gameDate=20240211&topPerformers=true',
        {
          headers: {
            'X-RapidAPI-Key': '5c2a423e0dmshb5dd537fe91a4c4p14232bjsn686555b9e803',
            'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
          }
        }
      );
      
      const data = await response.json();
      if (data && Array.isArray(data.body)) {
        const game = data.body.find((game: any) => 
          game.teams.some((team: any) => team.includes('Chiefs')) && 
          game.teams.some((team: any) => team.includes('Eagles'))
        );
        
        if (game) {
          setLiveScores({
            chiefs: parseInt(game.scores[0]) || 0,
            eagles: parseInt(game.scores[1]) || 0
          });
          toast.success("Scores updated!");
        }
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
      toast.error("Failed to fetch live scores");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveScores();
    const interval = setInterval(fetchLiveScores, 60000); // Update every minute
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
        [selectedQuarter]: square.player
      }));
      toast.success(`${selectedQuarter} winner: ${square.player}`);
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

          <div className="flex justify-between items-center gap-4">
            <div className="bg-red-600/20 backdrop-blur-lg rounded-xl p-4 flex-1 text-center">
              <div className="flex items-center justify-center gap-4">
                <img
                  src="lovable-uploads/7e47b99c-a255-4a58-8529-23088cc9c4d8.png"
                  alt="Chiefs Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="text-lg font-bold">Chiefs</h3>
                  <p className="text-3xl font-bold">{liveScores.chiefs}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={randomizeNumbers}
              className="bg-orange-600 hover:bg-orange-700 flex-shrink-0"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Randomize Numbers
            </Button>

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
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Chiefs Score"
                  value={scores.chiefs}
                  onChange={e => setScores(prev => ({ ...prev, chiefs: e.target.value }))}
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
                  onChange={e => setScores(prev => ({ ...prev, eagles: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white pl-12"
                />
                <img
                  src="lovable-uploads/b3057b61-455e-4346-b5e6-4b9efbf3eb9e.png"
                  alt="Eagles Logo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 object-contain"
                />
              </div>
            </div>
            <Button
              onClick={setQuarterScore}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Set Quarter Score
            </Button>

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
    </div>
  );
};

export default Index;
