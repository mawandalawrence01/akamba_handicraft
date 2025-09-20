"use client"

import { CldImage } from 'next-cloudinary'

export function CloudinaryExample() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Cloudinary Image Examples</h2>
      
      {/* Basic CldImage usage */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Basic Image</h3>
        <CldImage
          width="960"
          height="600"
          src="cld-sample-5" // This is a sample image from Cloudinary
          sizes="100vw"
          alt="Description of my image"
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Responsive image with transformations */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Responsive with Transformations</h3>
        <CldImage
          width="960"
          height="600"
          src="cld-sample-5"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="Responsive Cloudinary image"
          className="rounded-lg shadow-md"
          crop={{
            type: 'auto',
            source: true
          }}
          quality="auto"
          format="auto"
        />
      </div>

      {/* Square crop example */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Square Crop</h3>
        <CldImage
          width="400"
          height="400"
          src="cld-sample-5"
          sizes="(max-width: 768px) 100vw, 400px"
          alt="Square cropped image"
          className="rounded-lg shadow-md"
          crop="fill"
          gravity="auto"
          quality="auto"
          format="auto"
        />
      </div>

      {/* Multiple sizes for different breakpoints */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Multiple Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CldImage
            width="300"
            height="200"
            src="cld-sample-5"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Grid image 1"
            className="rounded-lg shadow-md"
            crop="fill"
            quality="auto"
            format="auto"
          />
          <CldImage
            width="300"
            height="200"
            src="cld-sample-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Grid image 2"
            className="rounded-lg shadow-md"
            crop="fill"
            quality="auto"
            format="auto"
          />
          <CldImage
            width="300"
            height="200"
            src="cld-sample-3"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Grid image 3"
            className="rounded-lg shadow-md"
            crop="fill"
            quality="auto"
            format="auto"
          />
        </div>
      </div>

      {/* Fill container example */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Fill Container</h3>
        <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-md">
          <CldImage
            src="cld-sample-5"
            fill
            sizes="100vw"
            alt="Fill container image"
            className="object-cover"
            crop="fill"
            quality="auto"
            format="auto"
          />
        </div>
      </div>

      {/* With effects */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">With Effects</h3>
        <CldImage
          width="600"
          height="400"
          src="cld-sample-5"
          sizes="(max-width: 768px) 100vw, 600px"
          alt="Image with effects"
          className="rounded-lg shadow-md"
          crop="fill"
          quality="auto"
          format="auto"
          effects={[
            {
              colorize: "50,co_blue"
            }
          ]}
        />
      </div>
    </div>
  )
}
