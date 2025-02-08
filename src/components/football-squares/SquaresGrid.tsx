
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player, Square } from "@/types/football";

interface SquaresGridProps {
  columnDigits: number[];
  rowDigits: number[];
  squares: Square[];
  players: Player[];
  assignPlayerToSquare: (row: number, col: number, playerName: string) => void;
}

export const SquaresGrid = ({
  columnDigits,
  rowDigits,
  squares,
  players,
  assignPlayerToSquare,
}: SquaresGridProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-lg rounded-lg bg-white/5 backdrop-blur-lg">
          <table className="min-w-full divide-y divide-white/10">
            <thead>
              <tr>
                <th className="p-4 text-center">KC vs PHI</th>
                {columnDigits.map((digit, i) => (
                  <th 
                    key={i} 
                    className="p-4 text-center border-l border-white/10"
                    style={{
                      backgroundImage: 'url("/lovable-uploads/067bd221-b180-49aa-8f25-6a51f346c6be.png")',
                      backgroundSize: '60%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundBlendMode: 'soft-light',
                      opacity: '0.25'
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="mt-1 text-6xl font-bold text-black">{digit === -1 ? "?" : digit}</span>
                    </div>
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
                        className="p-4 text-center border-l border-white/10 relative"
                      >
                        <div className="relative z-10 bg-black/50 rounded">
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
                        </div>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
