import { Image } from '@chakra-ui/react';
import logoImage from '../assets/logo.jpg';

export default function Logo({ width = '200px', ...props }) {
  console.log('Logo rendering...');
  return (
    <Image
      src={logoImage}
      alt="Workora"
      width={width}
      {...props}
    />
  );
}
