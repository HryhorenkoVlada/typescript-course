// not so useful
// can be used to represent the csv row


const drink = {
  color: 'blown',
  carbonated: true,
  sugar: 40
}

// The order is Very Important
// in this case we can swap the items without any errors
const pepsi = ['brown', true, 40]

// Type alias
type Drink = [string, boolean, number]

// in this case we CAN'T swap the items without any errors
const fanta: Drink = ['orange', true, 40]
// fanta[0] = 40 // error