import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'sizing', label: 'Size & Fit', icon: 'Package' },
    { id: 'care', label: 'Care', icon: 'Heart' },
    { id: 'sustainability', label: 'Sustainability', icon: 'Leaf' },
    { id: 'artisan', label: 'Artisan Story', icon: 'Users' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Materials</h4>
              <p className="text-muted-foreground">{product.materials}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Construction</h4>
              <p className="text-muted-foreground">{product.construction}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Origin</h4>
              <p className="text-muted-foreground">{product.origin}</p>
            </div>
          </div>
        );
      case 'sizing':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">How It Fits</h4>
              <p className="text-muted-foreground mb-4">{product.fitDescription}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <h5 className="font-medium text-foreground mb-3">Size Chart</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Chest</th>
                      <th className="text-left py-2">Waist</th>
                      <th className="text-left py-2">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.map((size, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-2 font-medium">{size.size}</td>
                        <td className="py-2 text-muted-foreground">{size.chest}</td>
                        <td className="py-2 text-muted-foreground">{size.waist}</td>
                        <td className="py-2 text-muted-foreground">{size.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'care':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-3">Care Instructions</h4>
              <div className="space-y-2">
                {product.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name={instruction.icon} size={16} className="text-accent mt-0.5" />
                    <span className="text-muted-foreground">{instruction.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'sustainability':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Environmental Impact</h4>
              <p className="text-muted-foreground mb-4">{product.sustainability.impact}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.sustainability.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Icon name={cert.icon} size={20} className="text-success" />
                  <div>
                    <p className="font-medium text-foreground">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'artisan':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Craftsmanship Story</h4>
              <p className="text-muted-foreground mb-4">{product.artisanStory.story}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{product.artisanStory.artisan}</p>
                  <p className="text-sm text-muted-foreground">{product.artisanStory.location}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{product.artisanStory.technique}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-300 border-b-2 ${
                activeTab === tab.id
                  ? 'text-accent border-accent' :'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;