// "use client";
// import CardComponent from "@/components/Card Component/CardComponent";
// import Title from "@/components/Title/title";
// import FilterBar from "@/components/FilterBar/FilterBar";
// import { useEffect, useState } from "react";


// export default function Home() {
//   const [initproduct,setinitproducts] = useState([]);
//   const [product, setProduct] = useState([]);
//   const [stores, setStores] = useState([]);
//   const [currentStores, setCurrentStores] = useState("");
//   const [bought, setBought] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState("");

//   const handleInputChange = (value) => {
//     setInputValue(value);
//   };


//   const fetchProducts = async () => {
//     setLoading(true);
//     const res = await fetch(`/api/fetchWatch`);
//     const data = await res.json();
//     // const filteredData = product.filter(item => item.stores === currentStores);
//     setLoading(false);
//     return data;
//   };

//   const filterProducts = async () => {
//     setLoading(true);
//     // const params = new URLSearchParams({
//     //   store: currentStores,
//     //   inputvalue: inputValue,
//     // });
//     // const res = await fetch(`/api/fetchWatch?${params}`);
//     // const data = await res.json();
//     let filteredData
//     if(currentStores==""){
//       filteredData = initproduct.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()))
//     }else{
//       let filteredData_stores = initproduct.filter(item => item.stores === currentStores);
//       filteredData = filteredData_stores.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()))
//     }
//     setLoading(false);
//     return filteredData;
//   };

//   const fetchStores = async () => {
//     const resStores = await fetch("/api/fetchStores");
//     const data = await resStores.json();
//     return data;
//   };

//   useEffect(() => {
//     fetchProducts().then((data) => {
//       setinitproducts(data);
//       setProduct(initproduct)
//     });

//     fetchStores().then((data) => {
//       setStores(data);
//       console.log(data);
//     });
//   }, []);

//   useEffect(() => {
//     filterProducts().then((data) => {
//       setProduct(data);
//     });
//   }, [currentStores, inputValue]);

//   return (
//     <div>
//       <title>終點站 搜尋器</title>
//       <Title />
//       <FilterBar
//         store={stores}
//         onshopchange={(value) => setCurrentStores(value)}
//         onboughtchange={(value) => setBought(value)}
//         inputValue={inputValue}
//         handleInputChange={handleInputChange}
//         startloading={()=> setLoading(true)}
//       />
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <CardComponent wt={product} bought={bought} />
//       )}
//     </div>
//   );
// }
"use client";
import CardComponent from "@/components/Card Component/CardComponent";
import Title from "@/components/Title/title";
import FilterBar from "@/components/FilterBar/FilterBar";
import { useEffect, useState } from "react";

export default function Home() {
  const [initproduct, setInitProducts] = useState([]); // Initial list of products
  const [product, setProduct] = useState([]);          // Current displayed products
  const [stores, setStores] = useState([]);            // Available stores
  const [currentStores, setCurrentStores] = useState("");// Current store filter
  const [bought, setBought] = useState(false);         // Bought filter
  const [loading, setLoading] = useState(false);       // Loading state
  const [inputValue, setInputValue] = useState("");    // Search input

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fetchWatch`);
      const data = await res.json();
      setInitProducts(data); // Set initial products
      setProduct(data);      // Set products to display initially
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    setLoading(true);
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

    setLoading(false);
    return filteredData;
};

  const fetchStores = async () => {
    try {
      const resStores = await fetch("/api/fetchStores");
      const data = await resStores.json();
      setStores(data);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };


  // Filter products when currentStores, inputValue, or initproduct changes
  useEffect(() => {
    setLoading(true)
    const filteredData = filterProducts();
    setProduct(filteredData);
    setLoading(false);
  }, [currentStores, inputValue, initproduct]);

  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, []); // Only run once on initial load

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
        startloading={() => setLoading(true)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CardComponent wt={product} bought={bought} />
      )}
    </div>
  );
}
