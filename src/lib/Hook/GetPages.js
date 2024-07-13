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

export const getpages = async (shop) => {
    if (shop === "TT") {
        try {
            const value = await TT_count();
            await watchpage.create({
                name: "TT",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting TT pages: ${error}`);
        }
    }
    if (shop === "YC") {
        try {
            const value = await YC_count();
            await watchpage.create({
                name: "YC",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting YC pages: ${error}`);
        }
    }if (shop === "XR") {
        try {
            const value = await XR_count();
            await watchpage.create({
                name: "XR",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting XR pages: ${error}`);
        }
    }if (shop === "WS") {
        try {
            const value = await WS_count();
            await watchpage.create({
                name: "WS",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting WS pages: ${error}`);
        }
    }if (shop === "AG") {
        try {
            const value = await AG_count();
            await watchpage.create({
                name: "AG",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting AG pages: ${error}`);
        }
    }if (shop === "BL") {
        try {
            const value = await BL_count();
            await watchpage.create({
                name: "BL",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting BL pages: ${error}`);
        }
    }if (shop === "emc2") {
        try {
            const value = await emc2_count();
            await watchpage.create({
                name: "emc2",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting emc2 pages: ${error}`);
        }
    }if (shop === "HS") {
        try {
            const value = await HS_count();
            await watchpage.create({
                name: "HS",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting HS pages: ${error}`);
        }
    }if (shop === "HS2") {
        try {
            const value = await HSe_count();
            await watchpage.create({
                name: "HSe",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting HS2 pages: ${error}`);
        }
    }if (shop === "JC") {
        try {
            const value = await JC_count();
            await watchpage.create({
                name: "JC",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting JC pages: ${error}`);
        }
    }if (shop === "MBW") {
        try {
            const value = await MBW_count();
            await watchpage.create({
                name: "MBW",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting MBW pages: ${error}`);
        }
    }if (shop === "PW") {
        try {
            const value = await PW_count();
            await watchpage.create({
                name: "PW",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting PW pages: ${error}`);
        }
    }if (shop === "RD") {
        try {
            const value = await RD_count();
            await watchpage.create({
                name: "RD",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting RD pages: ${error}`);
        }
    }if (shop === "TNJ") {
        try {
            const value = await TNJ_count();
            await watchpage.create({
                name: "TNJ",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting TNJ pages: ${error}`);
        }
    }if (shop === "YS") {
        try {
            const value = await YS_count();
            await watchpage.create({
                name: "YS",
                pages: value
            })
        } catch (error) {
            console.error(`Error getting YS pages: ${error}`);
        }
    }
}