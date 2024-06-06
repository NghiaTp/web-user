import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderStyle = {
    height: "100%",
    position: "relative",
  };
  const slideStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundImage: `url("${slides[currentIndex].image}")`,
  };

  const leftArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    left: "-20px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };

  const rightArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    right: "-20px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };
  const goToPrevious = () => {
    const isFirstSlide = currentIndex == 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }
  const goToNext = () => {
    const isLastSlide = currentIndex == slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }

  //slide tự chuyển trang

  useEffect(() => {
    const interval = setInterval(goToNext, 3500);
    return () => clearInterval(interval);
  }, [currentIndex])

  return (
    <div style={sliderStyle}>
      <div style={leftArrowStyles}>
        <img
          src={assets.left_icon}
          style={{
            width: 45,
            height: 45,
            backgroundColor: "white",
            borderRadius: 999,
          }}
          onClick={goToPrevious}
        />
      </div>
      <div style={rightArrowStyles}>
        <img
          src={assets.right_icon}
          style={{
            width: 45,
            height: 45,
            backgroundColor: "white",
            borderRadius: 999,
          }}
          onClick={goToNext}
        />
      </div>
      <div style={slideStyle}></div>
    </div>
  );
};

export default ImageSlider;
