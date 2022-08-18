const add = (a: number, b: number): number => {
  return a + b
}

const substract = (a: number, b: number): number => {
  return a - b
}

function divide(a: number, b: number): number {
  return a / b
}

function multiply(a: number, b: number): number {
  return a * b
}

const logger = (message: string): void => {
  console.log(message)
}

const todaysWeather = {
  date: new Date(),
  weater: 'sunny'
}

const logWeather = (forecast: { date: Date, weater: string }): void => {
  console.log(forecast)
}

logWeather(todaysWeather);
