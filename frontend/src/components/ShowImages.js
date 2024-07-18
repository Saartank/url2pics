import React, { useState, useEffect, useRef } from "react";

const resizeImages = (images, maxWidth) => {
  return images.map((image) => {
    if (image.width > maxWidth) {
      const aspectRatio = image.height / image.width;
      const newWidth = maxWidth;
      const newHeight = maxWidth * aspectRatio;
      return { ...image, width: newWidth, height: newHeight };
    }
    return image;
  });
};

const minimizeHeight = (images, containerWidth) => {
  images.sort((a, b) => b.height - a.height);

  let rows = [];
  let currentRow = [];
  let currentRowWidth = 0;
  let currentRowHeight = 0;
  let totalHeight = 0;

  images.forEach((image) => {
    let imageWidth = image.width;
    let imageHeight = image.height;

    if (imageWidth > containerWidth / 4) {
      imageWidth = containerWidth / 4;
      imageHeight = (imageHeight * (containerWidth / 4)) / image.width;
    }

    if (currentRowWidth + imageWidth <= (2 * containerWidth) / 3) {
      currentRow.push({ ...image, width: imageWidth, height: imageHeight });
      currentRowWidth += imageWidth;
      currentRowHeight = Math.max(currentRowHeight, imageHeight);
    } else {
      rows.push({ row: currentRow, height: currentRowHeight });
      totalHeight += currentRowHeight;

      currentRow = [{ ...image, width: imageWidth, height: imageHeight }];
      currentRowWidth = imageWidth;
      currentRowHeight = imageHeight;
    }
  });

  if (currentRow.length > 0) {
    rows.push({ row: currentRow, height: currentRowHeight });
    totalHeight += currentRowHeight;
  }

  return { totalHeight, rows };
};

const ShowImages = ({ images }) => {
  const [arrangedImages, setArrangedImages] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const maxWidth = containerWidth / 4;
        const resizedImages = resizeImages(images, maxWidth);
        const result = minimizeHeight(resizedImages, containerWidth);
        setArrangedImages(result.rows);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [images]);

  return (
    <div ref={containerRef} className="max-w-full mx-auto my-10">
      {arrangedImages.length > 0 ? (
        arrangedImages.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-4">
            {row.row.map((image, index) => (
              <img
                key={index}
                src={image.url}
                style={{ width: image.width, height: image.height }}
                className="block m-0 p-2"
                alt=""
              />
            ))}
          </div>
        ))
      ) : (
        <div className="text-center text-lg text-gray-600">
          Could not scrape any images.
        </div>
      )}
    </div>
  );
};

export default ShowImages;
