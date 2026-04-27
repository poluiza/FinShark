//import React from 'react';
//import logo from './logo.svg';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import './App.css';
import CardList from './Components/CardList/CardList';
import Search from './Components/Search/Search';
import { CompanySearch } from './company';
import { searchComponies } from './api';

function App() {
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
      
    const handLeChange = (e: ChangeEvent<HTMLInputElement>) => {
          setSearch(e.target.value);
          console.log(e);
      };
  
      const onClick = (e: SyntheticEvent) => {console.log(e);
        const result = await searchComponies(search)
      };
  
  return (
    <div className='App'>
      <Search onClick={onClick} search={search} handLeChange={handLeChange}/>
      <CardList />
    </div>
  );
}

export default App;