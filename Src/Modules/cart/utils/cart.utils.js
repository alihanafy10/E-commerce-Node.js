export const calculateCartTotale = (products) => {
     let subTotal = 0;
     products.forEach((p) => {
       subTotal += p.price * p.quantity;
     });
    return subTotal
}