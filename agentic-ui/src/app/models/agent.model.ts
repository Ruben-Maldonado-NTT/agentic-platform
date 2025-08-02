export class Agent {
    constructor(
      public name: string,
      public role: string,
      public agencyId: string | null = null,
      public type: 'agentEmbedded' = 'agentEmbedded',
      public highlight: boolean = false
    ) {}
  }
  