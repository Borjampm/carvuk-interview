import { supabase } from "../supabaseClient";
import {useState, useEffect} from 'react';
import { v4 as uuidv4 } from "uuid";


type Product = {
    id: number;
    name: string;
    price: number;
}

type CartItem = {
    product: Product;
    quantity: number;
}

export default function ProductList() {

    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        const existingItem = cart.find((item) => item.product.id === product.id);
        if (existingItem) {
            setCart(cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, {product, quantity: 1}]);
        }
    }
    const removeFromCart = (product: Product) => {
        setCart(cart.filter((item) => item.product.id !== product.id));
    }

    const guardarCarro = () => {
        const id: string = uuidv4();
        const cartItems = cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            cart_id: id
        }));
        cartItems.map((item) => {
            supabase
            .from("carritos")
            .insert(item)
            .then(({data, error}) => {
                if (error) { console.error('Error saving cart:', error); }
                console.log(data);
            })
        })
    }



    useEffect(() => {
        supabase
        .from("products")
        .select("*")
        .then(({data, error}) => {
            if (error) { console.error('Error loading products:', error); }
            setProducts(data);
        })
    }, []);


    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>{product.name} - {product.price} <button onClick={() => addToCart(product)}>Add to cart</button></li>
                ))}
            </ul>

            <h1>Cart</h1>
            <ul>
                {cart.map((item) => (
                    <li key={item.product.id}>{item.product.name} - {item.quantity} <button onClick={() => removeFromCart(item.product)}>Remove from cart</button></li>
                ))}
            </ul>
            <button onClick={() => guardarCarro()}>Guardar carro</button>
        </div>
    )}