export const dateStringToDate = (dateString: string): Date => {
    const dateParts = dateString
        .split('/') // [dd, mm, yyyy]
        .map((value: string): number => {
            return parseInt(value)
        }) 
    return new Date(dateParts[2], dateParts[1]-1, dateParts[0]) 
}