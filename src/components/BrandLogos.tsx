import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export interface SupportedBrand {
  id: string;
  name: string;
  category: string;
  originalColor: string;
}

export const SUPPORTED_BRANDS: SupportedBrand[] = [
  { id: 'samsung', name: 'Samsung', category: 'Appliances & TV', originalColor: '#034EA2' },
  { id: 'dell', name: 'Dell', category: 'Laptops & PC', originalColor: '#007DB8' },
  { id: 'lenovo', name: 'Lenovo', category: 'Laptops & PC', originalColor: '#E2231A' },
  { id: 'canon', name: 'Canon', category: 'Printers & Imaging', originalColor: '#CC0000' },
  { id: 'hp', name: 'HP', category: 'Laptops & Printers', originalColor: '#0096D6' },
  { id: 'voltas', name: 'Voltas', category: 'AC & Cooling', originalColor: '#005A9C' },
  { id: 'hitachi', name: 'Hitachi', category: 'AC & Refrigeration', originalColor: '#DE0000' },
  { id: 'lg', name: 'LG', category: 'Appliances & AC', originalColor: '#A50034' },
  { id: 'apple', name: 'Apple', category: 'Mac & Electronics', originalColor: '#000000' },
  { id: 'bosch', name: 'Bosch', category: 'Washing & Kitchen', originalColor: '#EA1B23' },
  { id: 'havells', name: 'Havells', category: 'Geyser & Appliances', originalColor: '#ED1C24' },
  { id: 'bajaj', name: 'Bajaj', category: 'Cooler & Appliances', originalColor: '#004899' },
  { id: 'kutchina', name: 'Kutchina', category: 'Chimney & Kitchen', originalColor: '#D9232D' },
  { id: 'hindware', name: 'Hindware', category: 'Chimney & Geyser', originalColor: '#E31E24' },
  { id: 'usha', name: 'Usha', category: 'Cooler & Fans', originalColor: '#0054A6' },
  { id: 'orient', name: 'Orient', category: 'Fans & Electrical', originalColor: '#F37021' },
  { id: 'bluestar', name: 'Blue Star', category: 'AC & Commercial', originalColor: '#0084CA' },
  { id: 'asus', name: 'Asus', category: 'Laptops & Hardware', originalColor: '#00539B' },
  { id: 'acer', name: 'Acer', category: 'Laptops & Monitors', originalColor: '#83B81A' },
  { id: 'epson', name: 'Epson', category: 'Printers & Scanners', originalColor: '#002D72' },
  { id: 'panasonic', name: 'Panasonic', category: 'AC & Appliances', originalColor: '#004098' },
  { id: 'godrej', name: 'Godrej', category: 'Refrigerator & AC', originalColor: '#9A162B' },
];

const BRAND_IMAGES: Record<string, any> = {
  samsung: require('../../assets/brands/samsung.png'),
  dell: require('../../assets/brands/dell.png'),
  lenovo: require('../../assets/brands/lenovo.png'),
  canon: require('../../assets/brands/canon.png'),
  hp: require('../../assets/brands/hp.png'),
  voltas: require('../../assets/brands/voltas.png'),
  hitachi: require('../../assets/brands/hitachi.png'),
  lg: require('../../assets/brands/lg.png'),
  apple: require('../../assets/brands/apple.png'),
  bosch: require('../../assets/brands/bosch.png'),
  havells: require('../../assets/brands/havells.png'),
  bajaj: require('../../assets/brands/bajaj.png'),
  kutchina: require('../../assets/brands/kutchina.png'),
  hindware: require('../../assets/brands/hindware.png'),
  usha: require('../../assets/brands/usha.png'),
  orient: require('../../assets/brands/orient.png'),
  bluestar: require('../../assets/brands/bluestar.png'),
  asus: require('../../assets/brands/asus.png'),
  acer: require('../../assets/brands/acer.png'),
  epson: require('../../assets/brands/epson.png'),
  panasonic: require('../../assets/brands/panasonic.png'),
  godrej: require('../../assets/brands/godrej.png'),
};

interface BrandLogoProps {
  brand: SupportedBrand;
  isHovered: boolean;
}

export function BrandLogo({ brand, isHovered }: BrandLogoProps) {
  const imageSource = BRAND_IMAGES[brand.id];

  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image
          source={imageSource}
          style={[
            styles.brandLogoImage,
            isHovered ? styles.brandLogoHovered : styles.brandLogoGrayscale,
          ]}
          resizeMode="contain"
        />
      ) : (
        <Text style={[styles.fallbackText, isHovered && { color: brand.originalColor }]}>
          {brand.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoImage: {
    width: 140,
    height: 48,
    maxWidth: '90%',
    maxHeight: '80%',
    transition: 'filter 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  } as any,
  brandLogoGrayscale: {
    filter: 'grayscale(100%) opacity(0.75) contrast(115%)',
  } as any,
  brandLogoHovered: {
    filter: 'none',
    transform: [{ scale: 1.08 }],
  } as any,
  fallbackText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});
