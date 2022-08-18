// necessary to add an annotation when the arr is empty
const carMakers = ['ford', 'toyota', 'chevy']
const dates = [new Date(), new Date()]

const carsByMake = [
  ['f150'],
  ['corolla'],
  ['camaro']
]

// help with inference when extracting values
const auto = carMakers[0]; // TS will consider auto var as a string

// prevent adding incompatible values
// carMakers.push(8) // error

// help with 'map'
carMakers.map((car: string): string => {
  return car; // autocomplete for 'string' is available
})

// Flexible types
const importantDates = [new Date(), '2030-10-10'] // type : (string | Date)[]