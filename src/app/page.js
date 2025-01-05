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

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const fetchProducts = async (isInitialFetch = false) => {
    if (isInitialFetch) setLoading(true); // Only show loading on initial fetch
    try {
      const res = await fetch("/api/fetchWatch");
      const data = await res.json();

      if (Array.isArray(data)) {
        setInitProducts(data); // Update initial products
        setProduct(filterProducts(data)); // Apply filters to new data
      } else {
        console.error("Expected an array, but got:", data);
        setInitProducts([]);
        setProduct([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setInitProducts([]);
      setProduct([]);
    } finally {
      if (isInitialFetch) setLoading(false);
    }
  };

  const filterProducts = (products = initproduct) => {
    let filteredData = products;

    if (currentStores !== "") {
      filteredData = filteredData.filter((item) => item.stores === currentStores);
    }

    if (inputValue !== "") {
      const searchTerms = inputValue.toLowerCase().split(" ");
      filteredData = filteredData.filter((item) => {
        const itemName = item.name.toLowerCase();
        return searchTerms.every((term) => itemName.includes(term));
      });
    }

    if (bought === "unsale") {
      const now = moment().utc();
      filteredData = filteredData.filter((item) => {
        const latestUpdate = moment(item.latestUpdate).utc();
        const differenceInMinutes = now.diff(latestUpdate, "minutes");
        return differenceInMinutes <= 60;
      });
    } else if (bought === "sale") {
      const now = moment().utc();
      filteredData = filteredData.filter((item) => {
        const latestUpdate = moment(item.latestUpdate).utc();
        const differenceInMinutes = now.diff(latestUpdate, "minutes");
        return differenceInMinutes >= 60;
      });
    }

    return filteredData;
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
    setLoading(true);
    const filteredData = filterProducts();
    setProduct(filteredData);
    setLoading(false);
  }, [currentStores, inputValue, bought]);

  const handleShopChange = (value) => {
    setLoading(true);
    setCurrentStores(value);
  };

  const handleBoughtChange = (value) => {
    setLoading(true);
    setBought(value);
  };

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
    </div>
  );
}
