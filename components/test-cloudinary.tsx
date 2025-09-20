"use client"

import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { useState } from 'react'

export function TestCloudinary() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Cloudinary Test</h2>
      
      {/* Test CldImage with sample image */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Sample Image:</h3>
        <CldImage
          src="cld-sample-5"
          width="300"
          height="200"
          alt="Sample image"
          crop="fill"
          quality="auto"
          format="auto"
        />
      </div>

      {/* Test upload widget */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Test:</h3>
        <CldUploadWidget
          uploadPreset="akamba_handicraft"
          onUpload={(result: any) => {
            if (result?.event === 'success') {
              setUploadedImage(result.info.secure_url)
            }
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Upload Image
            </button>
          )}
        </CldUploadWidget>
      </div>

      {/* Display uploaded image */}
      {uploadedImage && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
          <CldImage
            src={uploadedImage}
            width="300"
            height="200"
            alt="Uploaded image"
            crop="fill"
            quality="auto"
            format="auto"
          />
        </div>
      )}
    </div>
  )
}
