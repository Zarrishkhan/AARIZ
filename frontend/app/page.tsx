"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProductImage = {
  id: number;
  image: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  site: string;
  stock: number;
  created_at: string;
  images: ProductImage[];
};

const API_URL = "http://127.0.0.1:8000/api/products/";
const BACKEND_URL = "http://127.0.0.1:8000";

/*
  HERO IMAGE

  This is a direct image URL, so you do NOT need
  to create a hero.jpg file inside public.

  If you later want your own image, you can replace
  this URL with:

  /hero.jpg

  and put hero.jpg inside:
  frontend/public/
*/
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=2200&q=90";


export default function HomePage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);

  const [heroImageError, setHeroImageError] = useState(false);


  /*
    LOAD PRODUCTS
  */

  useEffect(() => {

    async function loadProducts() {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Products API returned ${response.status}`
          );
        }

        const data = await response.json();

        let productList: Product[] = [];

        if (Array.isArray(data)) {
          productList = data;
        }

        else if (Array.isArray(data.results)) {
          productList = data.results;
        }

        else if (Array.isArray(data.products)) {
          productList = data.products;
        }

        setProducts(productList);

      }

      catch (error) {

        console.error(
          "Product loading error:",
          error
        );

        setError(
          "Unable to load products. Please make sure Django is running."
        );

      }

      finally {

        setLoading(false);

      }

    }

    loadProducts();

  }, []);


  /*
    IMAGE URL
  */

  const getImageUrl = (
    image: string | undefined
  ) => {

    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    return `${BACKEND_URL}/${image}`;

  };


  /*
    BOYS PRODUCTS
  */

  const boysProducts = products
    .filter(
      (product) =>
        product.site === "men"
    )
    .slice(0, 4);


  /*
    GIRLS PRODUCTS
  */

  const girlsProducts = products
    .filter(
      (product) =>
        product.site === "girls"
    )
    .slice(0, 4);


  /*
    FALLBACK:
    If there are currently no products assigned
    to a particular site, don't show fake products.
  */


  return (

    <main className="min-h-screen bg-[#f7f6f2] text-[#151515]">


      {/* =====================================================
          SIDE MENU
      ====================================================== */}

      {menuOpen && (

        <div
          className="fixed inset-0 z-[100]"
        >

          {/* BACKDROP */}

          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />


          {/* MENU */}

          <aside
            className="
              relative
              h-full
              w-[320px]
              max-w-[85vw]
              bg-[#f8f7f3]
              px-8
              py-8
              shadow-2xl
            "
          >

            {/* MENU TOP */}

            <div className="flex items-center justify-between">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="
                  text-xl
                  font-medium
                  tracking-[0.35em]
                "
              >
                AARIZ
              </Link>


              <button
                onClick={() => setMenuOpen(false)}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  text-2xl
                  font-light
                  hover:opacity-50
                "
                aria-label="Close menu"
              >
                ×
              </button>

            </div>


            {/* MENU CONTENT */}

            <div className="mt-20">

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-black/40
                "
              >
                Explore
              </p>


              <div className="mt-7 flex flex-col">

                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-black/10
                    py-5
                    text-2xl
                    font-light
                    transition
                    hover:pl-2
                  "
                >
                  Home
                </Link>


                <Link
                  href="/products?site=men"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-black/10
                    py-5
                    text-2xl
                    font-light
                    transition
                    hover:pl-2
                  "
                >
                  Boys
                </Link>


                <Link
                  href="/products?site=girls"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-black/10
                    py-5
                    text-2xl
                    font-light
                    transition
                    hover:pl-2
                  "
                >
                  Girls
                </Link>


                <Link
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-black/10
                    py-5
                    text-2xl
                    font-light
                    transition
                    hover:pl-2
                  "
                >
                  Shop
                </Link>


                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="
                    border-b
                    border-black/10
                    py-5
                    text-2xl
                    font-light
                    transition
                    hover:pl-2
                  "
                >
                  Cart
                </Link>

              </div>

            </div>


            {/* MENU BOTTOM */}

            <div
              className="
                absolute
                bottom-8
                left-8
                right-8
              "
            >

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-black/30
                "
              >
                AARIZ
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-black/40
                "
              >
                Thoughtfully selected clothing
                for every day.
              </p>

            </div>

          </aside>

        </div>

      )}


      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav
        className="
          absolute
          left-0
          right-0
          top-0
          z-50
          text-white
        "
      >

        <div
          className="
            mx-auto
            flex
            h-24
            max-w-[1500px]
            items-center
            justify-between
            px-6
            md:px-12
          "
        >

          {/* HAMBURGER */}

          <button
            onClick={() => setMenuOpen(true)}
            className="
              group
              flex
              h-12
              w-12
              flex-col
              items-start
              justify-center
              gap-[6px]
            "
            aria-label="Open menu"
          >

            <span
              className="
                block
                h-[1px]
                w-9
                bg-white
                transition
                group-hover:w-7
              "
            />

            <span
              className="
                block
                h-[1px]
                w-7
                bg-white
                transition
                group-hover:w-9
              "
            />

            <span
              className="
                block
                h-[1px]
                w-9
                bg-white
              "
            />

          </button>


          {/* LOGO */}

          <Link
            href="/"
            className="
              absolute
              left-1/2
              -translate-x-1/2
              text-2xl
              font-medium
              tracking-[0.42em]
              md:text-3xl
            "
          >
            AARIZ
          </Link>


          {/* CART */}

          <Link
            href="/cart"
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.25em]
              transition
              hover:opacity-60
            "
          >
            Cart
          </Link>

        </div>

      </nav>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          relative
          min-h-[720px]
          overflow-hidden
          bg-[#171716]
          md:min-h-screen
        "
      >

        {/* HERO IMAGE */}

        {!heroImageError && (

          <img
            src={HERO_IMAGE}
            alt="AARIZ collection"
            onError={() =>
              setHeroImageError(true)
            }
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />

        )}


        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-black/45
          "
        />


        {/* EXTRA GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/75
            via-black/10
            to-black/30
          "
        />


        {/* HERO CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[720px]
            max-w-[1500px]
            items-end
            px-6
            pb-20
            md:min-h-screen
            md:px-12
            md:pb-24
          "
        >

          <div className="max-w-4xl">

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.45em]
                text-white/70
                md:text-xs
              "
            >
              The AARIZ Collection
            </p>


            <h1
              className="
                mt-6
                max-w-4xl
                text-5xl
                font-light
                leading-[0.95]
                tracking-[-0.04em]
                text-white
                sm:text-6xl
                md:text-8xl
                lg:text-[105px]
              "
            >
              Everyday
              <br />
              made beautiful.
            </h1>


            <p
              className="
                mt-8
                max-w-xl
                text-sm
                leading-7
                text-white/70
                md:text-base
              "
            >
              Thoughtfully selected clothing
              for boys and girls, made for
              the moments that matter.
            </p>


            <div className="mt-9">

              <Link
                href="/products"
                className="
                  inline-flex
                  items-center
                  justify-center
                  border
                  border-white
                  bg-white
                  px-8
                  py-4
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-black
                  transition
                  hover:bg-transparent
                  hover:text-white
                "
              >
                Explore Collection
              </Link>

            </div>

          </div>

        </div>


        {/* SCROLL INDICATOR */}

        <div
          className="
            absolute
            bottom-8
            right-8
            z-10
            hidden
            items-center
            gap-3
            text-[9px]
            uppercase
            tracking-[0.3em]
            text-white/60
            md:flex
          "
        >

          <span>
            Scroll
          </span>

          <span
            className="
              block
              h-[1px]
              w-10
              bg-white/40
            "
          />

        </div>

      </section>


      {/* =====================================================
          INTRO
      ====================================================== */}

      <section
        className="
          border-b
          border-black/10
          bg-[#f7f6f2]
        "
      >

        <div
          className="
            mx-auto
            max-w-[1100px]
            px-6
            py-24
            text-center
            md:px-10
            md:py-32
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.35em]
              text-black/40
            "
          >
            AARIZ
          </p>


          <h2
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-3xl
              font-light
              leading-tight
              tracking-[-0.02em]
              md:text-5xl
            "
          >
            Simple pieces.
            <br />
            Beautifully considered.
          </h2>


          <p
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-sm
              leading-7
              text-black/50
            "
          >
            AARIZ brings together modern,
            comfortable clothing with a
            timeless point of view.
          </p>

        </div>

      </section>


      {/* =====================================================
          BOYS
      ====================================================== */}

      <section
        className="
          border-b
          border-black/10
          bg-[#f7f6f2]
        "
      >

        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            py-20
            md:px-12
            md:py-28
          "
        >

          {/* SECTION HEADER */}

          <div
            className="
              flex
              items-end
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.35em]
                  text-black/40
                "
              >
                AARIZ
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-light
                  tracking-[-0.03em]
                  md:text-6xl
                "
              >
                Boys
              </h2>

            </div>


            <Link
              href="/products?site=men"
              className="
                hidden
                border-b
                border-black
                pb-1
                text-xs
                uppercase
                tracking-[0.2em]
                md:block
              "
            >
              View Boys
            </Link>

          </div>


          {/* PRODUCTS */}

          {loading && (

            <div
              className="
                mt-12
                grid
                grid-cols-2
                gap-4
                md:grid-cols-4
              "
            >

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      aspect-[3/4]
                      animate-pulse
                      bg-black/5
                    "
                  />

                )
              )}

            </div>

          )}


          {!loading &&
            !error &&
            boysProducts.length > 0 && (

              <div
                className="
                  mt-12
                  grid
                  grid-cols-2
                  gap-x-4
                  gap-y-10
                  md:grid-cols-4
                  md:gap-x-6
                "
              >

                {boysProducts.map(
                  (product) => {

                    const image =
                      product.images?.length
                        ? getImageUrl(
                            product.images[0].image
                          )
                        : "";

                    return (

                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group"
                      >

                        <div
                          className="
                            relative
                            aspect-[3/4]
                            overflow-hidden
                            bg-[#e8e6e0]
                          "
                        >

                          {image ? (

                            <img
                              src={image}
                              alt={product.name}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition
                                duration-700
                                group-hover:scale-[1.04]
                              "
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-xs
                                uppercase
                                tracking-[0.25em]
                                text-black/30
                              "
                            >
                              AARIZ
                            </div>

                          )}


                          {product.stock <= 0 && (

                            <div
                              className="
                                absolute
                                left-3
                                top-3
                                bg-black
                                px-3
                                py-2
                                text-[9px]
                                uppercase
                                tracking-[0.15em]
                                text-white
                              "
                            >
                              Out of stock
                            </div>

                          )}

                        </div>


                        <div className="mt-4">

                          <h3
                            className="
                              text-sm
                              font-medium
                            "
                          >
                            {product.name}
                          </h3>


                          <p
                            className="
                              mt-2
                              text-sm
                              text-black/50
                            "
                          >
                            Rs.{" "}
                            {Number(
                              product.price
                            ).toLocaleString()}
                          </p>

                        </div>

                      </Link>

                    );

                  }
                )}

              </div>

            )}


          {!loading &&
            !error &&
            boysProducts.length === 0 && (

              <div
                className="
                  mt-12
                  border
                  border-black/10
                  py-20
                  text-center
                "
              >

                <p
                  className="
                    text-sm
                    text-black/40
                  "
                >
                  No boys products available yet.
                </p>

              </div>

            )}


          {/* MOBILE BUTTON */}

          <div className="mt-10 md:hidden">

            <Link
              href="/products?site=men"
              className="
                inline-flex
                border-b
                border-black
                pb-1
                text-xs
                uppercase
                tracking-[0.2em]
              "
            >
              View Boys Collection
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          GIRLS
      ====================================================== */}

      <section
        className="
          border-b
          border-black/10
          bg-[#eeeae4]
        "
      >

        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            py-20
            md:px-12
            md:py-28
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              items-end
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.35em]
                  text-black/40
                "
              >
                AARIZ
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-light
                  tracking-[-0.03em]
                  md:text-6xl
                "
              >
                Girls
              </h2>

            </div>


            <Link
              href="/products?site=girls"
              className="
                hidden
                border-b
                border-black
                pb-1
                text-xs
                uppercase
                tracking-[0.2em]
                md:block
              "
            >
              View Girls
            </Link>

          </div>


          {/* PRODUCTS */}

          {loading && (

            <div
              className="
                mt-12
                grid
                grid-cols-2
                gap-4
                md:grid-cols-4
              "
            >

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      aspect-[3/4]
                      animate-pulse
                      bg-black/5
                    "
                  />

                )
              )}

            </div>

          )}


          {!loading &&
            !error &&
            girlsProducts.length > 0 && (

              <div
                className="
                  mt-12
                  grid
                  grid-cols-2
                  gap-x-4
                  gap-y-10
                  md:grid-cols-4
                  md:gap-x-6
                "
              >

                {girlsProducts.map(
                  (product) => {

                    const image =
                      product.images?.length
                        ? getImageUrl(
                            product.images[0].image
                          )
                        : "";

                    return (

                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group"
                      >

                        <div
                          className="
                            relative
                            aspect-[3/4]
                            overflow-hidden
                            bg-[#ddd8d0]
                          "
                        >

                          {image ? (

                            <img
                              src={image}
                              alt={product.name}
                              className="
                                h-full
                                w-full
                                object-cover
                                transition
                                duration-700
                                group-hover:scale-[1.04]
                              "
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-full
                                items-center
                                justify-center
                                text-xs
                                uppercase
                                tracking-[0.25em]
                                text-black/30
                              "
                            >
                              AARIZ
                            </div>

                          )}


                          {product.stock <= 0 && (

                            <div
                              className="
                                absolute
                                left-3
                                top-3
                                bg-black
                                px-3
                                py-2
                                text-[9px]
                                uppercase
                                tracking-[0.15em]
                                text-white
                              "
                            >
                              Out of stock
                            </div>

                          )}

                        </div>


                        <div className="mt-4">

                          <h3
                            className="
                              text-sm
                              font-medium
                            "
                          >
                            {product.name}
                          </h3>


                          <p
                            className="
                              mt-2
                              text-sm
                              text-black/50
                            "
                          >
                            Rs.{" "}
                            {Number(
                              product.price
                            ).toLocaleString()}
                          </p>

                        </div>

                      </Link>

                    );

                  }
                )}

              </div>

            )}


          {!loading &&
            !error &&
            girlsProducts.length === 0 && (

              <div
                className="
                  mt-12
                  border
                  border-black/10
                  py-20
                  text-center
                "
              >

                <p
                  className="
                    text-sm
                    text-black/40
                  "
                >
                  No girls products available yet.
                </p>

              </div>

            )}


          {/* MOBILE BUTTON */}

          <div className="mt-10 md:hidden">

            <Link
              href="/products?site=girls"
              className="
                inline-flex
                border-b
                border-black
                pb-1
                text-xs
                uppercase
                tracking-[0.2em]
              "
            >
              View Girls Collection
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURE STRIP
      ====================================================== */}

      <section
        className="
          border-b
          border-black/10
          bg-[#f7f6f2]
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-[1500px]
            md:grid-cols-3
          "
        >

          <div
            className="
              border-b
              border-black/10
              px-6
              py-12
              md:border-b-0
              md:border-r
              md:px-12
            "
          >

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              01
            </p>

            <h3
              className="
                mt-5
                text-xl
                font-light
              "
            >
              Thoughtful design
            </h3>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-black/45
              "
            >
              Clean silhouettes and timeless
              pieces designed for everyday wear.
            </p>

          </div>


          <div
            className="
              border-b
              border-black/10
              px-6
              py-12
              md:border-b-0
              md:border-r
              md:px-12
            "
          >

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              02
            </p>

            <h3
              className="
                mt-5
                text-xl
                font-light
              "
            >
              Made for every day
            </h3>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-black/45
              "
            >
              Comfortable clothing that feels
              as good as it looks.
            </p>

          </div>


          <div
            className="
              px-6
              py-12
              md:px-12
            "
          >

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              03
            </p>

            <h3
              className="
                mt-5
                text-xl
                font-light
              "
            >
              AARIZ quality
            </h3>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-black/45
              "
            >
              Carefully selected pieces for
              boys and girls.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section
        className="
          bg-[#171716]
          px-6
          py-28
          text-white
          md:py-36
        "
      >

        <div
          className="
            mx-auto
            max-w-4xl
            text-center
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.4em]
              text-white/40
            "
          >
            Discover AARIZ
          </p>


          <h2
            className="
              mt-6
              text-4xl
              font-light
              leading-tight
              tracking-[-0.03em]
              md:text-6xl
            "
          >
            Find something
            <br />
            made for you.
          </h2>


          <Link
            href="/products"
            className="
              mt-10
              inline-flex
              border
              border-white
              px-8
              py-4
              text-xs
              uppercase
              tracking-[0.22em]
              transition
              hover:bg-white
              hover:text-black
            "
          >
            Shop AARIZ
          </Link>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer
        className="
          bg-[#111110]
          px-6
          py-14
          text-white
          md:px-12
        "
      >

        <div
          className="
            mx-auto
            max-w-[1500px]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-12
              md:flex-row
              md:items-start
              md:justify-between
            "
          >

            {/* BRAND */}

            <div>

              <h2
                className="
                  text-2xl
                  font-medium
                  tracking-[0.4em]
                "
              >
                AARIZ
              </h2>

              <p
                className="
                  mt-5
                  max-w-xs
                  text-sm
                  leading-6
                  text-white/35
                "
              >
                Modern clothing for boys and
                girls, thoughtfully selected for
                everyday life.
              </p>

            </div>


            {/* LINKS */}

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-white/30
                "
              >
                Explore
              </p>


              <div
                className="
                  mt-5
                  flex
                  flex-col
                  gap-3
                "
              >

                <Link
                  href="/"
                  className="
                    text-sm
                    text-white/60
                    hover:text-white
                  "
                >
                  Home
                </Link>


                <Link
                  href="/products?site=men"
                  className="
                    text-sm
                    text-white/60
                    hover:text-white
                  "
                >
                  Boys
                </Link>


                <Link
                  href="/products?site=girls"
                  className="
                    text-sm
                    text-white/60
                    hover:text-white
                  "
                >
                  Girls
                </Link>


                <Link
                  href="/cart"
                  className="
                    text-sm
                    text-white/60
                    hover:text-white
                  "
                >
                  Cart
                </Link>

              </div>

            </div>

          </div>


          {/* COPYRIGHT */}

          <div
            className="
              mt-14
              border-t
              border-white/10
              pt-6
              text-xs
              text-white/25
            "
          >

            © 2026 AARIZ.
            All rights reserved.

          </div>

        </div>

      </footer>

    </main>

  );
}