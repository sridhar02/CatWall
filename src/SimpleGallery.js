import React from "react";

export const SimpleGallery = ({ cats }) => {
  return (
    <div>
      SimpleGallery
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))",
          gap: "16px",
          margin: "10px",
        }}
      >
        {cats.map((cat, index) => (
          <img
            key={index}
            src={cat?.url}
            alt=""
            className="h-72 w-72 rounded-md"
          />
        ))}
      </div>
    </div>
  );
};
