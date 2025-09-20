-- AlterTable
ALTER TABLE "public"."artisans" ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "cloudinaryUrl" TEXT,
ADD COLUMN     "imageFileSize" INTEGER,
ADD COLUMN     "imageFormat" TEXT,
ADD COLUMN     "imageHeight" INTEGER,
ADD COLUMN     "imageWidth" INTEGER,
ADD COLUMN     "isCloudinary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."blog_posts" ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "cloudinaryUrl" TEXT,
ADD COLUMN     "imageFileSize" INTEGER,
ADD COLUMN     "imageFormat" TEXT,
ADD COLUMN     "imageHeight" INTEGER,
ADD COLUMN     "imageWidth" INTEGER,
ADD COLUMN     "isCloudinary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "cloudinaryUrl" TEXT,
ADD COLUMN     "imageFileSize" INTEGER,
ADD COLUMN     "imageFormat" TEXT,
ADD COLUMN     "imageHeight" INTEGER,
ADD COLUMN     "imageWidth" INTEGER,
ADD COLUMN     "isCloudinary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."product_images" ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "cloudinaryUrl" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "isCloudinary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "cloudinaryUrl" TEXT,
ADD COLUMN     "imageFileSize" INTEGER,
ADD COLUMN     "imageFormat" TEXT,
ADD COLUMN     "imageHeight" INTEGER,
ADD COLUMN     "imageWidth" INTEGER,
ADD COLUMN     "isCloudinary" BOOLEAN NOT NULL DEFAULT false;
