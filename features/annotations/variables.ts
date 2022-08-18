// type annotation - : number, : string 
let apples: number = 5;
let speed: string = 'fast';
let hasName: boolean = true;
let nothingMuch: null = null;
let mothing: undefined = undefined;

// built in objects
let now: Date = new Date();

// Array
let colors: string[] = ['red', 'green', 'blue'];
let numbers: number[] = [1, 2, 3, 4];

// Classes
class Car {

}
let car: Car = new Car()

// Object literal
let point: { x: number, y: number } = {
  x: 10,
  y: 20,
}

// Functions

// full annotation
const logNumber1: (i: number) => void = (i: number) => {
  console.log(i)
}

const logNumber = (i: number): void => {
  console.log(i)
}


// USE type inferense Always

// USE type annotation
// 1) when we are doing the declaration & initialization on the different lines
// 2) when we want a variable to have a type that can't be inferred
// 3) when a function returns the 'any' type and we need to clarify the value

// 1 -when we are doing the declaration & initialization on the different lines
let words = ['red', 'green', 'blue'];
// let foundWorld; // has a type 'any' without type annotation 
let foundWorld: boolean;

for (let i = 0; i < words.length; i++) {
  if (words[i] === 'green') {
    foundWorld = true
  }
}

// 2 - when we want a variable to have a type that can't be inferred
let numbersArr = [-10, -1, 12];
let numbersAboveZero: boolean | number = false; // will throw an error wihout the type annottion cos TS doesn't undarstand the logic
for (let i = 0; i < numbersArr.length; i++) {
  if (numbersArr[i] > 0) {
    numbersAboveZero = numbersArr[i]
  }
}

// 3 - when a function returns the 'any' type and we need to clarify the value
const json = '{ "x": 10, "y": 20 }';
const coordinates: { x: number, y: number } = JSON.parse(json); // coordinates has a type 'any' without type annotation