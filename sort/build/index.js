"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NumbersCollection_1 = require("./NumbersCollection");
const CharactersCollection_1 = require("./CharactersCollection");
const LinkedList_1 = require("./LinkedList");
const numbersCollection = new NumbersCollection_1.NumbersCollection([10, 5, -11, 0]);
const charactersCollection = new CharactersCollection_1.CharactersCollection('Vlada');
// const sorter1 = new Sorter(numbersCollection)
// console.log(sorter1.collection);
// sorter1.sort()
// console.log(sorter1.collection);
// const sorter2 = new Sorter(charactersCollection)
// console.log(sorter2.collection);
// sorter2.sort()
// console.log(sorter2.collection);
const linkedList = new LinkedList_1.LinkedList();
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
linkedList.print();
linkedList.sort();
linkedList.print();
