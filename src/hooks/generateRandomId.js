export const randomString = () => {
    let r = (Math.random() + 1).toString(36).substring(7);
    return r
}