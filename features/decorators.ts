@classDecorator
class Boat {
  // adding decorators to properties is allowed bui it makes no sense(only like the fact that such property exists)
  color: string = 'red'

  get formattedColor(): string {
    return `This bout color is ${this.color}`
  }

  @logError('oops, boat was sunk')
  pilot(@parameterDecorator speed: string): void {
    if (speed === 'fast') {
      console.log('SWISH')
    } else {
      console.log('Noting')
    }


    // Throwing error to test logError decorator
    //throw new Error();

  }
}

function classDecorator(constructor: typeof Boat) {
  console.log(constructor)
}

function parameterDecorator(target: any, key: string, index: number) {
  console.log(key, index)
}

function logError(errorMessage: string) {
  return function (target: any, key: string, desc: PropertyDescriptor): void {
    const method = desc.value;

    desc.value = function () {
      try {
        method()
      } catch (e) {
        console.log(errorMessage)
      }
    }
  }
}
