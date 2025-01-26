import React, { Suspense } from 'react';
import GalleryGrid from '../../components/GalleryGrid';

// This component represents the Gallery page of the application
export default function GalleryPage() {
  return (
    <div>
      {/* Use React Suspense to handle loading state for the GalleryGrid component */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* The GalleryGrid component is responsible for displaying a grid of gallery items */}
        <GalleryGrid />
      </Suspense>
    </div>
  );
}
