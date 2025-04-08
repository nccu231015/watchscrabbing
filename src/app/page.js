"use client";
import CardComponent from "@/components/Card Component/CardComponent";
import Title from "@/components/Title/title";
import FilterBar from "@/components/FilterBar/FilterBar";
import { useEffect, useState } from "react";
import moment from "moment";

export default function Home() {
  const [initproduct, setInitProducts] = useState([]); // Initial list of products
  const [product, setProduct] = useState([]);          // Current displayed products
  const [stores, setStores] = useState([]);            // Available stores
  const [currentStores, setCurrentStores] = useState("");// Current store filter
  const [bought, setBought] = useState("");            // Bought filter
  const [loading, setLoading] = useState(true);       // Loading state
  const [inputValue, setInputValue] = useState("");    // Search input
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const fetchProducts = async (isInitialFetch = false, currentPage = 1) => {
    if (isInitialFetch) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      if (currentStores) params.append('store', currentStores);
      if (inputValue) params.append('inputvalue', inputValue);
      if (bought === "unsale") {
        filter.$and = [
          { latestUpdate: { $gte: moment().subtract(60, 'minutes').toDate() } }
        ];
      } else if (bought === "sale") {
        filter.$or = [
          { latestUpdate: { $lt: moment().subtract(60, 'minutes').toDate() } }
        ];
      }
      
      const res = await fetch(`/api/fetchWatch?${params}`);
      const data = await res.json();
      
      if (data.products) {
        if (currentPage === 1) {
          setInitProducts(data.products);
          setProduct(data.products);
        } else {
          setInitProducts(prev => [...prev, ...data.products]);
          setProduct(prev => [...prev, ...data.products]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      if (isInitialFetch) setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const filterProducts = (products) => {
    let filteredProducts = [...products];
    
    // 注意：API 已經處理了篩選，這裡不需要再次篩選
    // 如果 API 返回的數據已經符合篩選條件，這裡可以直接進行排序
    
    // 修改排序邏輯，根據 latestUpdate 時間決定使用哪個時間戳進行排序
    return filteredProducts.sort((a, b) => {
        const aSold = a.prices.some(price => price.price === "sold");
        const bSold = b.prices.some(price => price.price === "sold");
        
        // 如果兩個都是已售出，按照售出時間排序
        if (aSold && bSold) {
            // 找到標記為 sold 的價格記錄的時間
            const aSoldPrice = a.prices.find(price => price.price === "sold");
            const bSoldPrice = b.prices.find(price => price.price === "sold");
            
            const aSoldTime = moment(aSoldPrice?.updatedAt).utc();
            const bSoldTime = moment(bSoldPrice?.updatedAt).utc();
            
            return bSoldTime - aSoldTime; // 最新售出的在前面
        }
        
        // 如果只有一個已售出，已售出的排在後面
        if (aSold && !bSold) return 1;
        if (!aSold && bSold) return -1;
        
        // 獲取當前時間
        const now = moment().utc();
        
        // 計算 latestUpdate 與當前時間的差異（分鐘）
        const aLatestUpdate = moment(a.latestUpdate).utc();
        const bLatestUpdate = moment(b.latestUpdate).utc();
        const aDiffMinutes = now.diff(aLatestUpdate, "minutes");
        const bDiffMinutes = now.diff(bLatestUpdate, "minutes");
        
        // 決定使用哪個時間戳進行排序
        let aTime, bTime;
        
        // 如果 latestUpdate 距離現在一小時內，則使用 prices 當中最新的 updatedAt 數值
        if (aDiffMinutes <= 60 && a.prices.length > 0) {
            const aLastPrice = a.prices[a.prices.length - 1];
            aTime = moment(aLastPrice?.updatedAt).utc();
        } else {
            // 否則使用 latestUpdate 的數值
            aTime = aLatestUpdate;
        }
        
        if (bDiffMinutes <= 60 && b.prices.length > 0) {
            const bLastPrice = b.prices[b.prices.length - 1];
            bTime = moment(bLastPrice?.updatedAt).utc();
        } else {
            bTime = bLatestUpdate;
        }
        
        return bTime - aTime;
    });
  };

  const fetchStores = async () => {
    try {
      const resStores = await fetch("/api/fetchStores");
      const data = await resStores.json();
      if (Array.isArray(data)) {
        setStores(data);
      } else {
        console.error("Expected an array, but got:", data);
        setStores([]);
      }
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      setStores([]);
    }
  };

  useEffect(() => {
    // Initial fetch for products and stores
    fetchProducts(true);
    fetchStores();

    // Background fetch every 5 minutes
    const interval = setInterval(() => {
      fetchProducts(false); // Update products in the background
      console.log("product refetch")
    }, 300000); // 300,000 ms = 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPage(1); // 重置頁碼
    setInitProducts([]); // 清空現有資料
    setProduct([]); 
    fetchProducts(true, 1); // 重新獲取第一頁資料
  }, [currentStores, inputValue, bought]);

  const handleShopChange = (value) => {
    setLoading(true);
    setCurrentStores(value);
  };

  const handleBoughtChange = (value) => {
    setLoading(true);
    setBought(value);
  };

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 100
      ) {
        if (hasMore && !isLoadingMore && !loading) {
          setIsLoadingMore(true);
          setPage(prev => prev + 1);
          fetchProducts(false, page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, page, loading, currentStores, inputValue]);

  return (
    <div>
      <title>鐘點站 搜尋器</title>
      <Title />
      <FilterBar
        store={stores}
        onshopchange={handleShopChange}
        onboughtchange={handleBoughtChange}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        startloading={() => setLoading(true)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CardComponent wt={product} bought={bought} initValue={initproduct} />
      )}
      {isLoadingMore && (
        <div className="loading-more">
          載入更多資料中...
        </div>
      )}
    </div>
  );
}
