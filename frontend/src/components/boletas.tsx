import { supabase } from "../supabaseClient";
import {useState, useEffect} from 'react';

type Product = {
    id: number;
    name: string;
    price: number;
}

type CartItem = {
    product: Product;
    quantity: number;
}

type Cart = {
    id: string;
    cartItems: CartItem[];
}

export default function Boletas() {
    const [carritos, setCarritos] = useState<Cart[]>([]);

    useEffect(() => {
        supabase
        .from("carritos")
        .select("*")
        .then(({data, error}) => {
            if (error) { console.error('Error loading carritos:', error); }

            setCarritos(data as Cart[]);
        })
    }, []);
    return (
        <div>
            <h1>Boleta</h1>
            <h2>Productos</h2>
            <ul>
                {carritos.map((cart) => (
                        <li key={item.product.id}>{cart}}</li>
                    ))}

            </ul>
        </div>
    )
}