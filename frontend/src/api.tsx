import axios from "axios"
import { CompanySearch } from "./company"
import { error } from "console";

interface SearchResponse {
    data: CompanySearch[];
}

export const searchComponies = async (query: string) => {
    try {
        const data = await axios.get<SearchResponse>(
            `https://twelvedata.com/account/api-keys=${process.env.REACT_APP_API_KEY}`
        );
        return data;
    }

    catch (error) {

        if (axios.isAxiosError(error)) {
            console.log("Error message: ", error.message);
            return error.message;
        }

        else {
            console.log("unexpected error: ", error);
        return "An expected error has accured. | Ocorreu um erro esperado.";
        }
    }
}