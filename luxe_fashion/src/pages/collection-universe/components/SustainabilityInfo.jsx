import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SustainabilityInfo = () => {
  const sustainabilityFeatures = [
    {
      icon: "Leaf",
      title: "Organic Materials",
      description: "Made from certified organic cotton and sustainable fibers",
      percentage: 85
    },
    {
      icon: "Recycle",
      title: "Recycled Components",
      description: "Incorporating recycled materials in packaging and accessories",
      percentage: 70
    },
    {
      icon: "Users",
      title: "Fair Trade Certified",
      description: "Ensuring fair wages and working conditions for all artisans",
      percentage: 100
    },
    {
      icon: "Truck",
      title: "Carbon Neutral Shipping",
      description: "Offsetting all shipping emissions through verified programs",
      percentage: 100
    }
  ];

  return (
    <div className="bg-card py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
            <Icon name="Leaf" size={16} />
            <span className="text-sm font-medium">Sustainability Commitment</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
            Fashion with Purpose
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every piece in this collection is crafted with respect for our planet and the people who make it possible.
          </p>
        </div>

        {/* Sustainability Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {sustainabilityFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={feature.icon} size={24} className="text-success" />
              </div>

              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${feature.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-success">{feature.percentage}%</span>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="bg-muted rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">2.5M</div>
              <div className="text-muted-foreground">Liters of water saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">850</div>
              <div className="text-muted-foreground">Tons of CO₂ offset</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">1,200</div>
              <div className="text-muted-foreground">Artisans supported</div>
            </div>
          </div>
        </div>

        {/* Natural vs Synthetic Materials */}
        <div className="bg-gradient-to-r from-destructive/5 to-success/5 rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              Why We Choose Natural Over Synthetic
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Understanding the impact of synthetic materials helps us make better choices for our skin and planet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Problems with Synthetic Materials */}
            <div className="bg-background rounded-lg p-6 border border-destructive/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-destructive" />
                </div>
                <h4 className="text-xl font-semibold text-foreground">Synthetic Materials Issues</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Droplets" size={16} className="text-destructive mt-1" />
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Irritation</h5>
                    <p className="text-sm text-muted-foreground">They trap moisture and irritate sensitive skin.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="AlertCircle" size={16} className="text-destructive mt-1" />
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Allergies</h5>
                    <p className="text-sm text-muted-foreground">Made with chemicals that can trigger reactions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="Clock" size={16} className="text-destructive mt-1" />
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Long Decomposition</h5>
                    <p className="text-sm text-muted-foreground">Harmful to the planet and takes years to break down.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Natural Alternatives */}
            <div className="bg-background rounded-lg p-6 border border-success/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="Leaf" size={20} className="text-success" />
                </div>
                <h4 className="text-xl font-semibold text-foreground">Natural Alternatives We Use</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Flower" size={16} className="text-success mt-1" />
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Organic Cotton</h5>
                    <p className="text-sm text-muted-foreground">Breathable, soft, and grown without harmful pesticides.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="Wind" size={16} className="text-success mt-1" />
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Linen</h5>
                    <p className="text-sm text-muted-foreground">Naturally cooling and becomes softer with each wash.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Icon name="Sprout" size={16} className="text-success mt-1" />
                  <div>
                    <h5 className="font-medium text-foreground mb-1">Hemp & Jute</h5>
                    <p className="text-sm text-muted-foreground">Durable, sustainable fibers that improve with age.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button variant="outline" size="lg" iconName="ExternalLink" iconPosition="right">
            Learn More About Our Impact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityInfo;
