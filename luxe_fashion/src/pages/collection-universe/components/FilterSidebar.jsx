import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { convertUSDToINR, formatINR } from '../../../utils/currency';
import SizeChartModal from '../../../components/ui/SizeChartModal';

const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    size: true,
    color: true,
    price: true,
    sustainability: true
  });
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filterSections = [
    {
      id: 'category',
      title: 'Category',
      options: [
        { id: 'men', label: 'Men' },
        { id: 'women', label: 'Women' },
        { id: 'kids', label: 'Kids' }
      ]
    },
    {
      id: 'size',
      title: 'Size',
      options: [
        { id: 'XS', label: 'XS (6)' },
        { id: 'S', label: 'S (8)' },
        { id: 'M', label: 'M (10)' },
        { id: 'L', label: 'L (12)' },
        { id: 'XL', label: 'XL (14)' },
        { id: '2XL', label: '2XL (16)' },
        { id: '3XL', label: '3XL (18)' },
        { id: '4XL', label: '4XL (20)' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 bg-card border-r border-border z-50 lg:z-auto
        transform transition-transform duration-300 ease-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilterChange('clear')}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
          
          {/* Filter Sections */}
          <div className="space-y-6">
            {filterSections.map((section) => (
              <div key={section.id} className="border-b border-border pb-6 last:border-b-0">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <h4 className="font-medium text-foreground">{section.title}</h4>
                  <Icon 
                    name={expandedSections[section.id] ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-muted-foreground"
                  />
                </button>
                
                {expandedSections[section.id] && (
                  <div className="space-y-3">
                    {section.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-3">
                        {section.id === 'color' ? (
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: option.color }}
                            />
                            <Checkbox
                              checked={filters[section.id]?.includes(option.id) || false}
                              onChange={(e) => onFilterChange(section.id, option.id, e.target.checked)}
                            />
                            <label className="text-sm text-muted-foreground cursor-pointer flex-1">
                              {option.label}
                            </label>
                          </div>
                        ) : (
                          <>
                            <Checkbox
                              checked={filters[section.id]?.includes(option.id) || false}
                              onChange={(e) => onFilterChange(section.id, option.id, e.target.checked)}
                            />
                            <label className="text-sm text-muted-foreground cursor-pointer flex-1">
                              {option.label}
                            </label>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Size Chart Button for Size Section */}
                    {section.id === 'size' && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSizeChartOpen(true)}
                          className="w-full justify-center text-accent hover:text-accent/80"
                        >
                          View Size Chart
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />
    </>
  );
};

export default FilterSidebar;