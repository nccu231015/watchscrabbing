
"use client"
import CardComponent from "@/components/Card Component/CardComponent";
import Title from "@/components/Title/title";
import Card from "@/components/card/Card";
import Image from "next/image";
import { useEffect, useState } from "react";

import mongoose from 'mongoose';
import fetchWatchMiddleware from "@/lib/Database/fetchWatch";
import FilterBar from "@/components/FilterBar/FilterBar";





export default function Home() {

  const [product,setproduct] = useState([])
  const [stores, setstores] = useState([])
  const [currentsotres, setcurrentsotres] = useState("")
  const [bought,setbought] = useState(false)
  const [loading,setloading] =useState(false)

  const [inputValue, setinputValue] = useState("")

  const startloading = ()=>{
    setloading(true)
  }

  const handleInputChange = (value) => {
      setinputValue(value);
  };

  const fetchProducts = async (stores)=>{
    setloading(true)
    const params = new URLSearchParams({
      store: currentsotres,
      inputvalue: inputValue
    })
    const res = await fetch(`/api/fetchWatch?${params}`)
    const data = await res.json();
    setloading(false)
    return data
  }

  const fetchStores = async ()=>{
    const res_stores = await fetch("/api/fetchStores")
    const data = await res_stores.json();
    return data
  }


  useEffect(()=>{
    fetchProducts().then((data)=>{
      setproduct(data)
    })

    fetchStores().then((data)=>{
      setstores(data)
      console.log(data)
    })
  }, [])

  useEffect(()=>{
     fetchProducts().then((data)=>{
      setproduct(data)
    })
  },[currentsotres, inputValue])

  return (
    <div>
      <Title></Title>
      <FilterBar store={stores} onshopchange={value=>{
        setcurrentsotres(value)}} onboughtchange={value=>{
          setbought(value)}} inputValue={inputValue} handleInputChange={handleInputChange} startloading={startloading}
      ></FilterBar>
      {loading ? (
        <p>Loading...</p> // Replace with your preferred loading indicator
      ) : (
        <CardComponent wt={product} bought={bought} />
      )}
    </div>
  );
}
