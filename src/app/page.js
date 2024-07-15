"use client";
import CardComponent from "@/components/Card Component/CardComponent";
import Title from "@/components/Title/title";
import FilterBar from "@/components/FilterBar/FilterBar";
import { useEffect, useState } from "react";


export default function Home() {
  const [product, setProduct] = useState([]);
  const [stores, setStores] = useState([]);
  const [currentStores, setCurrentStores] = useState("");
  const [bought, setBought] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      store: currentStores,
      inputvalue: inputValue,
    });
    const res = await fetch(`/api/fetchWatch?${params}`);
    const data = await res.json();
    setLoading(false);
    return data;
  };

  const fetchStores = async () => {
    const resStores = await fetch("/api/fetchStores");
    const data = await resStores.json();
    return data;
  };

  useEffect(() => {
    fetchProducts().then((data) => {
      setProduct(data);
      console.log(data)
    });

    fetchStores().then((data) => {
      setStores(data);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProduct(data);
    });
  }, [currentStores, inputValue]);

  return (

          

    <div>
      <title>終點站 搜尋器</title>
      <Title />
      <FilterBar
        store={stores}
        onshopchange={(value) => setCurrentStores(value)}
        onboughtchange={(value) => setBought(value)}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        startloading={()=> setLoading(true)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CardComponent wt={product} bought={bought} />
      )}
    </div>
  );
}
