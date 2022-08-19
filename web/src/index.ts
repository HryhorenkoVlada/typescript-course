import { User } from "./models/User";
import { UserForm } from "./views/UserForm";

// const collection = User.buildUserCollection();

// collection.on('change', () => {
//     console.log(collection)
// })

// collection.fetch()

const user = User.buildUser({ id: 3, name: 'Bill', age: 33 })

user.get("age")

//const userForm = new UserForm(document.getElementById("root") as Element, user)

//userForm.render()
