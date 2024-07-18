const RandomImages = () => {
  return (
    <>
      <img
        src="landing-page-images/1.jpeg"
        alt="Random Image 1"
        className="absolute left-10 top-20 transform rotate-6 max-w-xs img-opacity z-0"
      />
      <img
        src="landing-page-images/cheetah.jpg"
        alt="Random Image 2"
        className="absolute left-10 bottom-10 transform -rotate-3 max-w-sm img-opacity z-0"
      />
      <img
        src="landing-page-images/3.jpg"
        alt="Random Image 3"
        className="absolute right-10 top-20 transform -rotate-12 max-w-xs img-opacity z-0"
      />
      <img
        src="landing-page-images/food2.avif"
        alt="Random Image 4"
        className="absolute right-10 bottom-20 transform rotate-12 max-w-xs img-opacity z-0"
      />
    </>
  );
};

export default RandomImages;
