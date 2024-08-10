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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fetchWatch");
      const data = await res.json();

      if (Array.isArray(data)) {
        setInitProducts(data); // Set initial products
        setProduct(data);      // Set products to display initially
      } else {
        console.error("Expected an array, but got:", data);
        setInitProducts([]);
        setProduct([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setInitProducts([]);
      setProduct([]);
    }
  };

  const filterProducts = () => {
    let filteredData = initproduct;

    // Filter by stores if selected
    if (currentStores !== "") {
        filteredData = filteredData.filter((item) => item.stores === currentStores);
    }

    // Filter by input value (search term)
    if (inputValue !== "") {
        const searchTerms = inputValue.toLowerCase().split(" ");
        filteredData = filteredData.filter((item) => {
            const itemName = item.name.toLowerCase();
            return searchTerms.every((term) => itemName.includes(term));
        });
    }

    // Filter by latest update time if bought === "unsale"
    if (bought === "unsale") {
        const now = moment().utc();
        filteredData = filteredData.filter((item) => {
            const latestUpdate = moment(item.latestUpdate).utc();
            const differenceInMinutes = now.diff(latestUpdate, 'minutes');
            return differenceInMinutes <= 60; // Only include items updated within the last hour
        });
    } else if (bought === "sale") {
      const now = moment().utc();
      filteredData = filteredData.filter((item) => {
          const latestUpdate = moment(item.latestUpdate).utc();
          const differenceInMinutes = now.diff(latestUpdate, 'minutes');
          return differenceInMinutes >= 60; // Only include items updated more than an hour ago
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
    fetchProducts();
    fetchStores();
  }, []); // Only run once on initial load

  useEffect(() => {
    setLoading(true)
    const filteredData = filterProducts();
    setProduct(filteredData);
    setLoading(false); // Stop loading once filtering is complete
  }, [currentStores, inputValue, bought]);


  // useEffect(()=>{
  //   setProduct(initproduct)
  // },[initproduct])

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
      <title>終點站 搜尋器</title>
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
