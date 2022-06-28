import { useState, useEffect } from "react";
import { FixedSizeGrid as Grid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { useWindowDimensions } from "../utils";

import "./App.css";

const Header = () => {
  return (
    <div className="w-full sticky top-0 h-16 bg-indigo-500 mb-4">
      <h1 className="text-2xl font-bold text-center py-4 text-white">
        Cats Wall
      </h1>
    </div>
  )
}


function App() {
  const [page, setPage] = useState(1)
  const [cats, setCats] = useState([]);
  const [isItemLoaded, setIsItemLoaded] = useState(false)

  const { width, height } = useWindowDimensions()

  const fetchCats = async ({ limit }) => {

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
      setIsItemLoaded(true)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const items = rowsCount * columns
    fetchCats({ limit: items, page });
  }, [page]);

  const COLUMN_WIDTH = 300
  const ROW_HEIGHT = 300

  const columns = Math.ceil(width / COLUMN_WIDTH) - 1

  const rowsCount = Math.ceil(height / ROW_HEIGHT) - 1

  const onNext = () => {
    setPage((t) => t + 1);
  };

  const Row = ({ rowIndex, columnIndex, style }) => {
    const item = cats[rowIndex * columns + columnIndex];
    return (
      <div div style={style} className="p-2" >
        <img src={item?.url} alt="" className="w-full h-full rounded-sm" />
      </div >
    )
  }

  const ItemsRendered = infiniteOnItemsRendered => ({
    visibleColumnStartIndex,
    visibleColumnStopIndex,
    visibleRowStartIndex,
    visibleRowStopIndex,
  }) => {
    const visibleStartIndex = visibleRowStartIndex * columns + visibleColumnStartIndex;
    const visibleStopIndex = visibleRowStopIndex * columns + visibleColumnStopIndex;

    infiniteOnItemsRendered({
      visibleStartIndex,
      visibleStopIndex,
    });
  };

  const requestCache = {}

  const loadMoreItems = (visibleStartIndex, visibleStopIndex) => {
    if (isItemLoaded) {
      return;
    }

    const key = [visibleStartIndex, visibleStopIndex].join(':');
    if (requestCache[key]) {
      return;
    }

    let itemsRetrieved = true;
    for (let i = visibleStartIndex; i < visibleStopIndex; i += 1) {
      if (!state.items[i]) {
        itemsRetrieved = false;
        break;
      }
    }

    if (itemsRetrieved) {
      requestCache[key] = key;
      return;
    }


  };

  const itemsCount = cats.length
  console.log({ columns, rowsCount })
  return (
    <div className="bg-blue-300">
      <Header />
      height -{height}, width-{width}
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
          gap: "16px",
          margin: "10px"
        }}
      >
        {cats.map((cat, index) => (
          <img key={index} src={cat?.url} alt="" className="h-72 w-72 rounded-md" />
        ))}
      </div> */}

      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadMoreItems}
        itemCount={itemsCount}
      >
      </InfiniteLoader>
      {({ onItemsRendered, ref }) => (
        <Grid
          onItemsRendered={ItemsRendered(onItemsRendered)}
          columnCount={columns}
          columnWidth={COLUMN_WIDTH}
          height={height - 30}
          rowCount={rowsCount}
          rowHeight={ROW_HEIGHT}
          width={width}
          ref={ref}
        >
          {Row}

        </Grid>
      )}
    </div>
  );
}

export default App;
