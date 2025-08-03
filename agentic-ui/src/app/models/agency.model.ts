export class Agency {
    constructor(
      public name: string,
      public type: 'agencyGroup' = 'agencyGroup',
      public highlight: boolean = false
    ) {}
  
    static from(data: any): Agency {
      return new Agency(
        data.name || '',
        data.type === 'agencyGroup' ? 'agencyGroup' : 'agencyGroup',
        !!data.highlight
      );
    }
  }
  