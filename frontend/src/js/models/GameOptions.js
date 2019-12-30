export class GameOptions {
    constructor() {
        this.availableRaces = ['Human', 'Tauran'];
        this.race = 0;
        this.availableDifficulties = ['Easy', 'Medium', 'Hard'];
        this.difficulty = 0;
        this.availableCampaigns = [0, 1];
        this.campaign = 0;
    }

    nextRace() {
        this.race += 1;
        if (this.race >= this.availableRaces.length) this.race = 0;
    }

    nextDifficulty() {
        this.difficulty += 1;
        if (this.difficulty >= this.availableDifficulties.length) this.difficulty = 0;
    }

    displayRace() {
        return this.availableRaces[this.race];
    }

    displayDifficulty() {
        return this.availableDifficulties[this.difficulty];
    }

    displayCampaign(index) {
        return [
            'Fallen Haven',
            'The last hope campaign'
        ][index];
    }
}
