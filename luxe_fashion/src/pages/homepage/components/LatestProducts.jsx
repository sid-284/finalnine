import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { apiFetch } from '../../../utils/api';
import { convertUSDToINR, formatINR } from '../../../utils/currency';

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await apiFetch('/product/list');
        // Sort by newest using explicit date field or timestamps
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => {
              const aDate = Number(a?.date) || new Date(a?.createdAt || 0).getTime();
              const bDate = Number(b?.date) || new Date(b?.createdAt || 0).getTime();
              return bDate - aDate;
            })
          : [];
        setProducts(sorted.slice(0, 4));
      } catch (err) {
        console.error('Failed to load latest products:', err);
        setError('Failed to load latest products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (error || loading || products.length === 0) {
    // Render nothing if loading/failed/no products to keep homepage clean
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-14">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent mb-4">
            <Icon name="Clock" size={16} className="mr-2" />
            Latest Arrivals
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground">
            Just In
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => {
            const pid = product._id || product.id;
            const imageSrc = product.image1 || product.images?.[0] || product.image || '/assets/images/no_image.png';

            return (
              <Link key={pid} to={`/product-detail?id=${pid}`} className="group">
                <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-[3/4] overflow-hidden">
                    <Image src={imageSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {formatINR(convertUSDToINR(product.price))}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link to="/collection-universe">
            <Button variant="outline" size="lg" className="px-8 py-3">
              View All Products
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;


