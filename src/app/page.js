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
      
      const res = await fetch(`/api/fetchWatch?${params}`);
      const data = await res.json();
      
      if (data.products) {
        if (currentPage === 1) {
          setInitProducts(data.products);
          setProduct(filterProducts(data.products));
        } else {
          setInitProducts(prev => [...prev, ...data.products]);
          setProduct(prev => [...prev, ...filterProducts(data.products)]);
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
    
    if (bought === "unsale") {
      const now = moment().utc();
      filteredProducts = products.filter((item) => {
        const latestUpdate = moment(item.latestUpdate).utc();
        const differenceInMinutes = now.diff(latestUpdate, "minutes");
        return differenceInMinutes <= 60;
      });
    } else if (bought === "sale") {
      const now = moment().utc();
      filteredProducts = products.filter((item) => {
        const latestUpdate = moment(item.latestUpdate).utc();
        const differenceInMinutes = now.diff(latestUpdate, "minutes");
        return differenceInMinutes >= 60;
      });
    }

    // 複雜排序邏輯
    return filteredProducts.sort((a, b) => {
      // 首先檢查是否已售出
      const aSold = a.prices.some(price => price.price === "sold");
      const bSold = b.prices.some(price => price.price === "sold");
      
      // 如果一個已售出而另一個未售出，未售出的優先
      if (aSold && !bSold) return 1;
      if (!aSold && bSold) return -1;
      
      // 如果售出狀態相同，則比較最後更新時間
      const aLastPrice = a.prices[a.prices.length - 1];
      const bLastPrice = b.prices[b.prices.length - 1];
      
      const aTime = moment(aLastPrice?.updatedAt).utc();
      const bTime = moment(bLastPrice?.updatedAt).utc();
      
      return bTime - aTime;  // 降序排列，最新的在前面
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
