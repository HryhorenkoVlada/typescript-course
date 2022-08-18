import { Sorter } from "./Sorter";
import { NumbersCollection } from "./NumbersCollection";
import { CharactersCollection } from "./CharactersCollection";
import { LinkedList } from "./LinkedList";

const numbersCollection = new NumbersCollection([10, 5, -11, 0])
const charactersCollection = new CharactersCollection('Vlada')
// const sorter1 = new Sorter(numbersCollection)
// console.log(sorter1.collection);
// sorter1.sort()
// console.log(sorter1.collection);

// const sorter2 = new Sorter(charactersCollection)
// console.log(sorter2.collection);
// sorter2.sort()
// console.log(sorter2.collection);

const linkedList = new LinkedList();
linkedList.addNode(5);
linkedList.addNode(-3);
linkedList.addNode(0);
linkedList.addNode(11);

// linkedList.print()
// const sorter3 = new Sorter(linkedList);
// sorter3.sort()
// linkedList.print()

// console.log(numbersCollection);
// numbersCollection.sort()
// console.log(numbersCollection);


// console.log(charactersCollection);
// charactersCollection.sort()
// console.log(charactersCollection);

linkedList.print()
linkedList.sort()
linkedList.print();