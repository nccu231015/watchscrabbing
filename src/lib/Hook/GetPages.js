import { TT_count } from "../TTWatches";


export const getpages = async (shop) => {
    if (shop === "TT") {
        try {
            const value = await TT_count();
            console.log(value)
        } catch (error) {
            console.error(`Error getting TT pages: ${error}`);
        }
    }
}