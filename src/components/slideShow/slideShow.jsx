import React, { useState } from 'react';
import './slide.css';

const Slideshow = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handlePrevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1);
    };

    const handleNextSlide = () => {
        setCurrentSlide(currentSlide === images.length - 1 ? 0 : currentSlide + 1);
    };

    console.log('entrei aqui')

    return (
        <div className="slideshow-container">
            <div className="slideshow">
                <div className="slide-container">
                    <img src={images[currentSlide]} alt={`Slide ${currentSlide}`} />
                </div>
                <button className="prev" onClick={handlePrevSlide}>&#10094;</button>
                <button className="next" onClick={handleNextSlide}>&#10095;</button>
            </div>
        </div>
    );
};

export default Slideshow;
