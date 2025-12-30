import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className="card-category group"
      data-testid={`category-${category.id}`}
    >
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-white shadow-sm">
        <img
          src={category.image_url}
          alt={category.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <span className="text-xs font-medium text-center text-[#2D0036] line-clamp-2 group-hover:text-[#2D0036]">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
