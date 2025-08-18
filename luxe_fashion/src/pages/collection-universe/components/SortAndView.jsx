import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import SizeChartModal from '../../../components/ui/SizeChartModal';

const SortAndView = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onFilterToggle,
  totalProducts
}) => {
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const viewModes = [
    { id: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { id: 'masonry', icon: 'LayoutGrid', label: 'Masonry View' },
    { id: 'list', icon: 'List', label: 'List View' }
  ];

  return (
    <div className="bg-card border-b border-border sticky top-16 z-30 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Side - Filter Toggle & Results */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterToggle}
              iconName="Filter"
              iconPosition="left"
              className="lg:hidden"
            >
              Filters
            </Button>
            
            <div className="hidden sm:flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSizeChartOpen(true)}
                className="text-accent hover:text-accent/80"
              >
                Size Chart
              </Button>
            </div>
          </div>

          {/* Right Side - Sort & View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="hidden sm:block">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                placeholder="Sort by"
                className="w-48"
              />
            </div>
            
            {/* Mobile Sort */}
            <div className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowUpDown"
                iconPosition="left"
              >
                Sort
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center space-x-1 bg-muted rounded-lg p-1">
              {viewModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange(mode.id)}
                  className="px-3"
                >
                  <Icon name={mode.icon} size={16} />
                </Button>
              ))}
            </div>
            
            {/* Mobile View Toggle */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                iconName={viewMode === 'grid' ? 'Grid3X3' : viewMode === 'list' ? 'List' : 'LayoutGrid'}
                onClick={() => {
                  const modes = ['grid', 'list', 'masonry'];
                  const currentIndex = modes.indexOf(viewMode);
                  const nextIndex = (currentIndex + 1) % modes.length;
                  onViewModeChange(modes[nextIndex]);
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Results Count */}
        <div className="sm:hidden mt-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSizeChartOpen(true)}
            className="text-accent hover:text-accent/80"
          >
            Size Chart
          </Button>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />
    </div>
  );
};

export default SortAndView;