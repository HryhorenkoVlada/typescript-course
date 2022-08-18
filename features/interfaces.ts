interface Reprtable {
  name: string;
  year: number;
  broken: boolean;
  summary(): string
}

const oldCivic = {
  name: 'civic',
  year: 2000,
  broken: true,
  summary(): string {
    return `
    Name: ${this.name}
    Year: ${this.year}
    Broken: ${this.broken}
  `
  }
}

const printSummarhy = (item: Reprtable): void => {
  console.log(item.summary())
}

printSummarhy(oldCivic)