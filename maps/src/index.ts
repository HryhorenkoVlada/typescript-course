import { User } from "./User";
import { Company } from "./Company";
import { CustomMap } from "./CustomMap";

const user = new User();
const company = new Company()
const cusotomMap = new CustomMap('map'); 

cusotomMap.addMarker(user);
cusotomMap.addMarker(company);