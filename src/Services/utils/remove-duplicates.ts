export function removeDuplicates(objArr: object[], keys: string[]) {
    return objArr?.filter((obj, index) => index === objArr.findIndex(subObj => keys.every(key => subObj[key] === obj[key])))
}