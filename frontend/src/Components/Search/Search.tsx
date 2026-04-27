import React, { ChangeEvent, JSX, useState, SyntheticEvent } from 'react'

interface Props {
    
}

const Search: React.FC<Props> = (props: Props) : JSX.Element=> {
    const [search,setSearch] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        setSearch(e.target.value);
        console.log(e);
    };
    const onClick = (e: SyntheticEvent) => {
        console.log(e);
    };
    return (
        <div>
            <input value = {search} onChange={(e) => handleChange(e)} type="text" />
            <button onClick={(e) => onClick(e)}/>
        </div>
    )
}

export default Search