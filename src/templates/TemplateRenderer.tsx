import React from 'react';
import { TemplateProps } from './types';

// Free Templates
import { ClassicMenu } from './ClassicMenu';
import { SimpleRestaurant } from './SimpleRestaurant';
import { BasicModern } from './BasicModern';

// Premium Templates
import { ModernFoodGallery } from './ModernFoodGallery';
import { ElegantRestaurant } from './ElegantRestaurant';
import { MinimalWhite } from './MinimalWhite';
import { DarkFoodMenu } from './DarkFoodMenu';
import { ColorfulCafe } from './ColorfulCafe';
import { PremiumDining } from './PremiumDining';

// Premium Plus Templates
import { LuxuryBlackGold } from './LuxuryBlackGold';
import { FineDining } from './FineDining';
import { RoyalRestaurant } from './RoyalRestaurant';
import { GlassmorphismMenu } from './GlassmorphismMenu';
import { AdvancedFoodShowcase } from './AdvancedFoodShowcase';
import { ExclusiveSignature } from './ExclusiveSignature';

interface TemplateRendererProps extends TemplateProps {
  templateCode: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ templateCode, ...props }) => {
  switch (templateCode) {
    // 3 Free
    case 'classic_menu':
      return <ClassicMenu {...props} />;
    case 'simple_restaurant':
      return <SimpleRestaurant {...props} />;
    case 'basic_modern':
      return <BasicModern {...props} />;

    // 6 Premium
    case 'modern_food_gallery':
      return <ModernFoodGallery {...props} />;
    case 'elegant_restaurant':
      return <ElegantRestaurant {...props} />;
    case 'minimal_white':
      return <MinimalWhite {...props} />;
    case 'dark_food_menu':
      return <DarkFoodMenu {...props} />;
    case 'colorful_cafe':
      return <ColorfulCafe {...props} />;
    case 'premium_dining':
      return <PremiumDining {...props} />;

    // 6 Premium Plus
    case 'luxury_black_gold':
      return <LuxuryBlackGold {...props} />;
    case 'fine_dining':
      return <FineDining {...props} />;
    case 'royal_restaurant':
      return <RoyalRestaurant {...props} />;
    case 'glassmorphism_menu':
      return <GlassmorphismMenu {...props} />;
    case 'advanced_food_showcase':
      return <AdvancedFoodShowcase {...props} />;
    case 'exclusive_signature':
      return <ExclusiveSignature {...props} />;

    default:
      return <ClassicMenu {...props} />;
  }
};
