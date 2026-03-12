import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

interface CarouselProps {
  children: React.ReactNode;
  options?: EmblaOptionsType;
}

const EmblaCarousel: React.FC<CarouselProps> = ({ children, options }) => {
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {React.Children.map(children, (child, index) => (
            <div className="embla__slide" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { EmblaCarousel };
