// src/components/Container.tsx
import React from 'react';
import Banner from './Banner';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className='container mx-auto p-4'>{children}</div>;
};

export default Container;
