import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { watchpassword } from "./src/lib/Database/database.js";
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

// 連接到 MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✅ MongoDB 連接成功');
        }
    } catch (error) {
        console.error('❌ MongoDB 連接失敗:', error);
        process.exit(1);
    }
};

// 更新或建立用戶認證
const updateCredentials = async (username, password) => {
    try {
        await connectDB();

        // 檢查用戶是否已存在
        const existingUser = await watchpassword.findOne({ username: username });
        
        // 生成鹽值並加密密碼
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (existingUser) {
            // 更新現有用戶的密碼
            await watchpassword.updateOne(
                { username: username },
                { password: hashedPassword }
            );
            console.log(`✅ 用戶 "${username}" 的密碼已成功更新`);
        } else {
            // 建立新用戶
            await watchpassword.create({
                username: username,
                password: hashedPassword
            });
            console.log(`✅ 新用戶 "${username}" 已成功建立`);
        }

        // 驗證密碼是否正確設置
        const verification = await bcrypt.compare(password, hashedPassword);
        console.log(`🔐 密碼驗證: ${verification ? '成功' : '失敗'}`);
        
    } catch (error) {
        console.error('❌ 更新認證時發生錯誤:', error);
    } finally {
        // 關閉資料庫連接
        await mongoose.connection.close();
        console.log('📡 資料庫連接已關閉');
    }
};

// 執行更新
const main = async () => {
    console.log('🚀 開始更新用戶認證...');
    console.log('📝 新認證資訊:');
    console.log('   帳號: Hourstack');
    console.log('   密碼: hs90006080');
    console.log('');

    await updateCredentials('Hourstack', 'hs90006080');
    
    console.log('');
    console.log('🎉 認證更新完成！');
    console.log('💡 現在您可以使用新的帳號密碼登入應用程式');
};

// 執行主函數
main().catch(console.error);
