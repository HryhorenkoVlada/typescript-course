//import faker from 'faker' ;
import { randFirstName, randLatitude, randLongitude } from '@ngneat/falso';

export class User {
    name: string;
    location: {
        lat: number;
        lng: number;
    }
    constructor() {
        this.name = randFirstName();
        this.location = {
            lat: randLatitude(),
            lng: randLongitude()
        }
    }

    markerContent(): string {
        return `User name: ${this.name}`
    }
}