export class Agent {
    constructor(
      public name: string,
      public role: string,
      public agencyId: string | null = null,
      public type: 'agentEmbedded' = 'agentEmbedded',
      public highlight: boolean = false
    ) {}
  
    static from(data: any): Agent {
      return new Agent(
        data.name || '',
        data.role || '',
        data.agencyId || null,
        data.type === 'agentEmbedded' ? 'agentEmbedded' : 'agentEmbedded',
        !!data.highlight
      );
    }
  }
  