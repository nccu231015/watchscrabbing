import { watchesss } from "./Database/database";
import {fs} from "fs"
import { fetchWatchMiddleware} from "./Database/fetchWatch"

const loadUrls = ()=>{
    const data = fs.readFileSync('./test.watchdatas.json')
    const jsonData = JSON.parse(data)
    return jsonData.map(item=>item._id)
}

const watches_delete = async ()=>{
    await fetchWatchMiddleware();
    const urls = loadUrls();
    for(const url of urls){
        try {
            const result = await watchesss.deleteMany({ webp: url });
            console.log(`Deleted ${result.deletedCount} documents with webp: ${url}`);
          } catch (error) {
            console.error(`Error deleting documents with webp: ${url}`, error);
          }
    }
    console.log("Deletion completed");
}

watches_delete();
