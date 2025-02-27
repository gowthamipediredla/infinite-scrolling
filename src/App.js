import "./styles.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastItemref = useCallback(
    (node) => {
      observer.current && observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [hasMore, isLoading]
  );
  async function fetchData() {
    setIsLoading(true);
    const rej = await fetch(
      `https://openlibrary.org/search.json?q=air&page=${page}`
    );
    const res = await rej.json();
    setHasMore(res.docs.length > 0);
    setData((prev) => (page === 1 ? [...res.docs] : [...prev, ...res.docs]));
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <div className="App">
      <h1>Infinite Scroll</h1>
      <div>
        {data?.map(({ title }, index) => {
          return (
            <div
              className="product"
              ref={index === data.length - 1 ? lastItemref : null}
              key={index}
            >
              <p>{title}</p>
            </div>
          );
        })}
        {isLoading ? <div className="loading">...loading</div> : null}
      </div>
    </div>
  );
}
