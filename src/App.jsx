import React, { useState, useEffect, useRef } from "react";
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { Header } from "../components/Header"
import { useWindowDimensions } from "../utils";

// Default constants
const ITEM_WIDTH = 400
const ITEM_HEIGHT = 360

function App() {
  const infiniteLoaderRef = useRef()

  // A fixed number of limit that we are getting from the api
  const [limit] = useState(20)
  // initial page number
  const [page, setPage] = useState(0)

  const [cats, setCats] = useState([]);
  const [hasMore] = useState(true)

  const { width, height } = useWindowDimensions()

  const fetchCats = async ({ page }) => {
    try {
      const apiResponse = await fetch(
        `https://api.thecatapi.com/v1/images/search?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_SOME_KEY,
          },
        }
      );
      const result = await apiResponse.json();
      setCats(state => [...state, ...result]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCats({ page });
  }, [page]);

  const loadMoreItems = () => {
    setPage((state) => state + 1);
  };

  function generateIndexesForRow(rowIndex, maxItemsPerRow, itemsAmount) {
    const result = [];
    const startIndex = rowIndex * maxItemsPerRow;

    for (let i = startIndex; i < Math.min(startIndex + maxItemsPerRow, itemsAmount); i++) {
      result.push(i);
    }

    return result;
  }

  function getMaxItemsAmountPerRow(width) {
    return Math.max(Math.floor(width / ITEM_WIDTH), 1);
  }

  function getRowsAmount(width, itemsAmount, hasMore) {
    const maxItemsPerRow = getMaxItemsAmountPerRow(width);

    return Math.ceil(itemsAmount / maxItemsPerRow) + (hasMore ? 1 : 0);
  }

  const RowItem = React.memo(function RowItem({ movieId, }) {
    const cat = movieId
    return (
      <div item className="p-2" style={{
        width: ITEM_WIDTH
      }} key={cat?.id}>
        <img src={cat?.url} alt="" className="w-full h-full rounded-sm" />
      </div>
    );
  });

  const rowRenderer = ({ index, style }) => {
    const maxItemsPerRow = getMaxItemsAmountPerRow(width);
    const Ids = generateIndexesForRow(index, maxItemsPerRow, cats.length).map(movieIndex => cats[movieIndex]);

    return (
      <div style={style} className="flex justify-center">
        {Ids.map((movieId, index) => (
          <RowItem key={index} movieId={movieId} />
        ))}
      </div>
    )
  };

  const itemsCount = cats.length

  return (
    <div className="bg-blue-300">
      <Header />

      <InfiniteLoader
        ref={infiniteLoaderRef}
        itemCount={itemsCount}
        isItemLoaded={({ index }) => {
          const maxItemsPerRow = getMaxItemsAmountPerRow(width);
          const allItemsLoaded = generateIndexesForRow(index, maxItemsPerRow, cats.length).length > 0;

          return !hasMore || allItemsLoaded;
        }}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            className="my-4"
            height={height}
            width={width}
            itemCount={itemsCount}
            itemSize={ITEM_HEIGHT}
            onItemsRendered={onItemsRendered}
          >
            {rowRenderer}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
}

export default App;
