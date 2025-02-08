
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { Player } from "@/types/football";
import { toast } from "sonner";

interface PlayerInputProps {
  players: Player[];
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  addPlayer: () => void;
}

export const PlayerInput = ({ players, newPlayerName, setNewPlayerName, addPlayer }: PlayerInputProps) => {
  return (
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
  );
};
