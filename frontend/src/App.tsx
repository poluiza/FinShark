import React, { ChangeEvent, SyntheticEvent, useState} from 'react';
import './App.css';
import CardList from './Components/CardList/CardList';
import Search from './Components/Search/Search';
import ListPortfolio from "./Components/Portfolio/ListPortfolio/ListPortfolio";
import { CompanySearch } from './company';
import { searchComponies } from './api';

function App() {
  const [search, setSearch] = useState<string>("");
  const [PortfolioValues, setPortfolioValues] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(e);
  };

  const onPortfolioCreate = (e: any) =>{
    e.preventDefault();
    const exists = PortfolioValues.find((value) => value ===e.target[0].value)
    if(exists) return;
    const updatePortfolio = [...PortfolioValues, e.target[0].value];
    setPortfolioValues(updatePortfolio);
  }

  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await searchComponies(search);

    if (typeof result === "string") {
      setServerError(result);
    }

    else if (Array.isArray(result)) {
      setSearchResult(result);
    }

    console.log(searchResult);
  };

  return (
    <div className='App'>
      <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange}/>
      {serverError && <h1>{serverError}</h1>}
     <ListPortfolio PortfolioValues={PortfolioValues}/>
      <CardList searchResults={searchResult} onPortfolioCreate={onPortfolioCreate}/>
      {serverError && <div> Unable to connect to API</div>}
    </div>
  );
}

export default App;