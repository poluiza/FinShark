import React, { ChangeEvent, JSX, useState, SyntheticEvent, FormEvent } from "react";
import './Search.css';

interface Props {
    onClick: (e: SyntheticEvent) => void;
    search: string | undefined;
    handLeChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Search: React.FC<Props> = ({ onClick, search, handLeChange }: Props): JSX.Element => {
    return (
        <div>
            <input value={search} onChange={(e) => handLeChange(e)}></input>
            <button onClick={(e) => onClick(e)} />
        </div>
    );
}

export default Search;