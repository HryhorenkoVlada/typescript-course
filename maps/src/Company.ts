import {randBrand, randCompanyName, randLatitude, randLongitude} from '@ngneat/falso'

export class Company {
    companyName: string;
    brand: string;
    location: {
        lat: number;
        lng: number;
    }

    constructor() {
        this.companyName = randCompanyName();
        this.brand = randBrand();
        this.location = {
            lat: randLatitude(),
            lng: randLongitude()

        }
    }

    markerContent(): string {
        return `
            <div>
                <h1>Company name: ${this.companyName}</h1>
                <h3>Brand: ${this.brand}</h3>
            </div>
        `
    }
}