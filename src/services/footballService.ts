
export const fetchLiveScores = async () => {
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
      return {
        chiefs: parseInt(game.scores[0]) || 0,
        eagles: parseInt(game.scores[1]) || 0
      };
    }
  }
  throw new Error('Could not fetch live scores');
};
