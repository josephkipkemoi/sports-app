export const validateNumber = ( number )  => {

    if(number.length > 10 || number.length !== 10) {
        return 'Invalid number format'
    }     

    return ''
}