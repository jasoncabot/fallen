export class GameOptions {
  name: string;
  race: number;
  difficulty: number;
  campaign: number;

  private readonly races = ['Human', 'Tauran'];
  private readonly difficulties = ['Easy', 'Medium', 'Hard'];
  private readonly campaigns = ['Fallen Haven', 'The last hope campaign'];

  constructor() {
    this.name = '';
    this.race = 0;
    this.difficulty = 0;
    this.campaign = 0;
  }

  nextRace(): void {
    this.race = (this.race + 1) % this.races.length;
  }

  nextDifficulty(): void {
    this.difficulty = (this.difficulty + 1) % this.difficulties.length;
  }

  displayRace(): string {
    return this.races[this.race];
  }

  displayDifficulty(): string {
    return this.difficulties[this.difficulty];
  }

  availableCampaigns(): string[] {
    return this.campaigns;
  }
}
