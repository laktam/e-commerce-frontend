import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


type Props = {
    isLoggedInSetter: React.Dispatch<React.SetStateAction<boolean>>;
    token: string;
    cartId: number;
    // setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}
export function Logout(props: Props) {
    const navigate = useNavigate()

    useEffect(
        () => {
            localStorage.setItem('token', '')
            localStorage.setItem('isLoggedIn', 'false')
            localStorage.setItem('cartId', '')
            localStorage.setItem('total', '')
            props.isLoggedInSetter(false)
            localStorage.setItem('isAdmin', '')
            // props.setIsAdmin(false)
            navigate('/sign-in')
        }
        , []
    )

    return <div >
    </div>
}

// useEffect(
//     () => {
//         const cartId = localStorage.getItem('cartId')

//         axios.get(process.env.REACT_APP_BASE_URL + 'cart/all/' + cartId,
//             {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             }).then(
//                 //correct product qtt when logging out
//                 (response) => {
//                     //increment qtt for each product still in the cart
//                     response.data.products.map(
//                         (prod: any) => {
//                             axios.put(process.env.REACT_APP_BASE_URL + 'product/updateQtt'
//                                 , {
//                                     productId: prod.id,
//                                     // productQtt: (Number(props.quantity) + 1),
//                                     // productQtt: qtt + 1,
//                                     productQtt: prod.quantity + 1
//                                 }
//                                 , {
//                                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//                                 })


//                         }
//                     )

//                     //delete cart
//                     axios.delete(process.env.REACT_APP_BASE_URL + 'cart/delete/' + cartId, {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem('token')}`
//                         }
//                     }).then(
//                         (res) => {

//                             localStorage.setItem('token', '')
//                             localStorage.setItem('isLoggedIn', 'false')
//                             localStorage.setItem('cartId', '')
//                             localStorage.setItem('total', '')
//                             props.isLoggedInSetter(false)
//                             navigate('/sign-in')

//                         }
//                     ).catch(
//                         (err) => {
//                             console.log(err);
//                         }
//                     )

//                 }

//             ).catch(
//                 (err) => {
//                     console.log(err);
//                 }
//             )
//     }, [])