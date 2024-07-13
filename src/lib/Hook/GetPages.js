import { TT_count } from "../TTWatches";
import { YC,url_YC, YC_count } from '../YongChang.js';
import { XinRue_main, XR_count, url_XR } from '../XinRue.js';
import { WS_url, WS_main, WS_count } from '../watchstore.js';
import { AG_count, url_AG, AGan_main } from '../AGan.js';
import { BL_count, url_BL, BayLin_main } from '../BayLin.js';
import { emc2_count, emc2_main, url_emc2 } from '../emc2.js';
import { HS_Main, HS_count, url_HS } from '../HanShiJi.js';
import { HSe_count, HSe_url, HSe_main } from '../HongSen.js';
import { JC_count, JC_url, JC_main } from '../JinChen.js';
import { url_MBW,MBW_main, MBW_count } from '../MingBiaoWo.js';
import { PW_count,PW_url,PW_main } from '../playwatch.js';
import { RD_url, RD_main, RD_count } from '../Radar.js';
import { TNJ_count, TNJ_main, url_TNJ } from '../TaiNanJing.js';
import { YS_count, YS_url, YS_main } from '../scrabbing.js';

import { watchpage } from "../Database/database";

const pagesBlock = async (countfunc,shop,database) =>{
    try {
        const value = await countfunc();
        const exists = await database.exists({name:shop})
        const watch = await database.where("name").equals(shop)
        if(!exists){
            console.log(`${shop} not exists ready to add}`)
            await database.create({
                name: shop,
                pages: value
            })
            console.log(`sucessfully add with ${value}`)
        }

        else{
            watch[0].pages = value
            await watch[0].save();
            console.log(`already exists with new value ${value}`)
        }

    } catch (error) {
        console.error(`Error getting ${shop} pages: ${error}`);
    }
}

export const getpages = async (shop) => {
    if (shop === "TT") {
       await pagesBlock(TT_count,"TT",watchpage)
    }
    if (shop === "YC") {
        await pagesBlock(YC_count,"YC",watchpage)
    }if (shop === "XR") {
        await pagesBlock(XR_count,"XR",watchpage)
    }if (shop === "WS") {
        await pagesBlock(WS_count,"WS",watchpage)
    }if (shop === "AG") {
        await pagesBlock(AG_count,"AG",watchpage)
    }if (shop === "BL") {
        await pagesBlock(BL_count,"BL",watchpage)
    }if (shop === "emc2") {
        await pagesBlock(emc2_count,"emc2",watchpage)
    }if (shop === "HS") {
        await pagesBlock(HS_count,"HS",watchpage)
    }if (shop === "HSe") {
        await pagesBlock(HSe_count,"HSe",watchpage)
    }if (shop === "JC") {
        await pagesBlock(JC_count,"JS",watchpage)
    }if (shop === "MBW") {
        await pagesBlock(MBW_count,"WBW",watchpage)
    }if (shop === "PW") {
        await pagesBlock(PW_count,"PW",watchpage)
    }if (shop === "RD") {
        await pagesBlock(RD_count,"RD",watchpage)
    }if (shop === "TNJ") {
        await pagesBlock(TNJ_count,"TNJ",watchpage)
    }if (shop === "YS") {
        await pagesBlock(YS_count,"YS",watchpage)
    }
}