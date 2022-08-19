import { Attributes } from "./Attributes";
import { Eventing } from "./Eventing";
import { ApiSync } from "./ApiSync";
import { Model } from "./Model";
import { Collection } from "./Collection";

export interface UserProps {
    id?: number;
    name?: string;
    age?: number;
}

const rootUrl = 'http://localhost:3000/users'

export class User extends Model<UserProps>{

    // public events: Eventing = new Eventing();
    // public sync: Sync<UserProps> = new Sync<UserProps>('http://localhost:3000/users')
    // public attributes: Attributes<UserProps>

    // constructor(public attrs: UserProps) {
    //     this.attributes = new Attributes<UserProps>(attrs)
    // }

    static buildUser(attrs: UserProps): User {
        return new User(
            new Attributes<UserProps>(attrs),
            new Eventing(),
            new ApiSync<UserProps>(rootUrl),
        )
    }

    static buildUserCollection(): Collection<User, UserProps> {
        return new Collection<User, UserProps>(
            rootUrl,
            (json: UserProps) => User.buildUser(json)
        )
    }

}