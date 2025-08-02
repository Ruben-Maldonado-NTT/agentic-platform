export class Agency {
    constructor(
      public name: string,
      public type: 'agencyGroup' = 'agencyGroup',
      public highlight: boolean = false
    ) {}
  }