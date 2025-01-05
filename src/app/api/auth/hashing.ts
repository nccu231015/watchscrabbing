import fetchWatchMiddleware from "../../../lib/Database/fetchWatch";
import bcrypt from "bcrypt";
import { watchpassword } from "../../../lib/Database/database";

// 定義 watchpassword 的結構
interface WatchPassword {
    username: string;
    password: string;
}

// 加密密碼並存入數據庫
export const password_crypt = async (username: string, password: string): Promise<void> => {
    try {
        const salt = await bcrypt.genSalt(10); // 生成鹽值
        const hash = await bcrypt.hash(password, salt); // 將密碼加密
        await watchpassword.create({
            username,
            password: hash,
        });
        console.log("Password added successfully");
    } catch (error) {
        console.error("Error during password encryption:", error);
    }
};

// 驗證密碼
export const check_password = async (
    username: string,
    password: string
): Promise<[boolean, WatchPassword | null]> => {
    try {
        // 查詢用戶數據
        const cor_pwd_obj = await watchpassword.where("username").equals(username).exec(); // 確保數據庫支持 Promise
        if (!cor_pwd_obj || cor_pwd_obj.length === 0) {
            return [false, null];
        }
        const cor_pwd = cor_pwd_obj[0].password;

        // 比對密碼
        const isMatch = await bcrypt.compare(password, cor_pwd);
        return [isMatch, cor_pwd_obj[0] || null];
    } catch (error) {
        console.error("Error during password verification:", error);
        return [false, null];
    }
};
