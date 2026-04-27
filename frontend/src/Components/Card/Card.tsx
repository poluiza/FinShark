import React, { JSX } from "react";
import './Card.css';

interface Props {
    companyName: String;
    ticker: String;
    price: number;

}

const Card: React.FC<Props> = ({companyName, ticker, price}: Props) : JSX.Element => {
    return (
        <div className="card">
            <img src="https://picsum.photos/300/300" alt="Foto Aleatória" />
            <div className="details"> 
                <h2>{companyName} ({ticker})</h2> 
                <p>${price}</p>
            </div>
            <p className="infon">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur nihil, aspernatur quod, perspiciatis quam quidem perferendis eos fugiat, quis esse libero voluptates amet modi impedit soluta vitae tempore laboriosam totam!</p>
        
        </div>
    )
}

export default Card