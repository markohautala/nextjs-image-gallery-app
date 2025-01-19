import React, { Suspense } from 'react';
import GalleryGrid from '../../components/GalleryGrid';

export default function GalleryPage() {
  return (
    <div>
      {/* Wrap the GalleryGrid component with Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <GalleryGrid />
      </Suspense>
    </div>
  );
}
