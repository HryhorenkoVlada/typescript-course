import fs from 'fs';

export abstract class CsvFileReader <T>{
    filename: string;
    data: T[] = [];

    constructor(filename: string) {
        this.filename = filename
    }

    abstract mapRow(row: string[]): T;

    read(): void {
        this.data = fs.readFileSync(this.filename, {
            encoding: 'utf-8' // to get the string from readFileSync method
        })
            .split('\n')
            .map((row: string): string[] => row.split(','))
            .map(this.mapRow)
    }
    
}