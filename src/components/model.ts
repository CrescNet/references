export interface Term {
  name: string
  iri: string
}

interface Method extends Term {
  abbreviation?: string
}

interface Source {
  format?: string
  source?: string
  access: 'public' | 'restricted' | 'on request'
}

export interface Publication {
  name: string
  year: number
  url: string
  citation: string
}

export interface RefDataSet {
  disease?: string
  region?: string
  feature: string
  unit?: string
  method: string
  dataSet: Source
  domainRanges: {
    feature: string
    values?: string[]
    min?: number
    max?: number
    unit?: string
  }[]
}

export interface RefPublication extends Publication {
  dataSets: RefDataSet[]
}

export interface DataSet {
  publication: Publication
  disease?: Term
  region?: Term
  feature: Term
  unit?: Term
  method: Method
  dataSet: Source
  domainRanges: {
    feature: Term
    values?: string[]
    min?: number
    max?: number
    unit?: Term
  }[]
}
