interface IConfiguration {key: string, value: string}

export interface IConfigPresetComposition {
    id: number
    key: string
    configurations: IConfiguration[]
  }